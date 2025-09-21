import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import '../../app/constants.dart';
import '../../models/symptom/symptom_model.dart';
import '../../providers/symptom/symptom_provider.dart';
import '../../widgets/common/app_bar.dart';
import '../../widgets/common/loading_indicator.dart';
import '../../widgets/common/error_display.dart';
import '../../providers/chat/chat_provider.dart';

/// Screen to display symptom analysis results
class SymptomAnalysisScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const SymptomAnalysisScreen({
    super.key,
    required this.analysisId,
  });

  /// ID of the analysis to display
  final String analysisId;

  @override
  ConsumerState<SymptomAnalysisScreen> createState() => _SymptomAnalysisScreenState();
}

class _SymptomAnalysisScreenState extends ConsumerState<SymptomAnalysisScreen> {
  SymptomAnalysisResult? _cachedResult;
  bool _isLoading = true;
  bool _hasError = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadAnalysisResult();
    });
  }

  Future<void> _loadAnalysisResult() async {
    setState(() {
      _isLoading = true;
      _hasError = false;
      _errorMessage = null;
    });

    // For 'latest', use the direct access method
    if (widget.analysisId == 'latest') {
      final notifier = ref.read(symptomAnalysisResultNotifierProvider.notifier);
      final result = notifier.getCurrentResult();
      
      if (result != null) {
        setState(() {
          _cachedResult = result;
          _isLoading = false;
        });
        print('Loaded latest result with ${result.possibleConditions.length} conditions and ID: ${result.id}');
        return;
      }
    }
    
    // Try to load from the async provider as backup
    try {
      final asyncValue = ref.read(symptomAnalysisResultNotifierProvider);
      if (asyncValue.hasValue && asyncValue.value != null) {
        setState(() {
          _cachedResult = asyncValue.value;
          _isLoading = false;
        });
        print('Loaded result from async provider with ID: ${asyncValue.value!.id}');
        return;
      }
    } catch (e) {
      print('Error reading from async provider: $e');
    }
    
    // Last resort: Try to read directly from SharedPreferences
    try {
      final prefs = await SharedPreferences.getInstance();
      String? resultJson;
      
      if (widget.analysisId == 'latest') {
        // Try to get the latest result
        resultJson = prefs.getString('latest_symptom_result');
        print('Attempting to load latest result directly from SharedPreferences');
      } else {
        // Try to get a specific result by ID
        resultJson = prefs.getString('symptom_result_${widget.analysisId}');
        print('Attempting to load result ${widget.analysisId} directly from SharedPreferences');
      }
      
      if (resultJson != null) {
        try {
          final resultMap = jsonDecode(resultJson);
          final result = SymptomAnalysisResult.fromJson(resultMap);
          setState(() {
            _cachedResult = result;
            _isLoading = false;
          });
          print('Successfully loaded result from SharedPreferences with ID: ${result.id}');
          return;
        } catch (e) {
          print('Error parsing result from SharedPreferences: $e');
          setState(() {
            _hasError = true;
            _errorMessage = 'Error parsing saved analysis: $e';
          });
        }
      }
    } catch (e) {
      print('Error loading from SharedPreferences: $e');
      setState(() {
        _hasError = true;
        _errorMessage = 'Error loading analysis: $e';
      });
    }
    
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Show loading indicator while fetching
    if (_isLoading) {
      return Scaffold(
        appBar: const LifeSyncAppBar(
          title: 'Symptom Analysis',
        ),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Loading analysis results...'),
            ],
          ),
        ),
      );
    }
    
    // Show the cached result if available
    if (_cachedResult != null) {
      print('Building UI with cached result: ${_cachedResult!.id} with ${_cachedResult!.possibleConditions.length} conditions');
      return Scaffold(
        appBar: const LifeSyncAppBar(
          title: 'Symptom Analysis',
        ),
        body: _buildAnalysisResults(context, _cachedResult!, ref),
      );
    }
    
    // Show error if there's one
    if (_hasError) {
      return Scaffold(
        appBar: const LifeSyncAppBar(
          title: 'Symptom Analysis',
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 72, color: Colors.orange),
              const SizedBox(height: 16),
              Text(
                'Error Loading Analysis',
                style: theme.textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage ?? 'An error occurred loading the analysis results.',
                style: theme.textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: () => context.go('/symptoms'),
                icon: const Icon(Icons.arrow_back),
                label: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }
    
    // Otherwise show the "No Results" UI
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Symptom Analysis',
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.healing_rounded, size: 72, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'No Analysis Results',
              style: theme.textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Please add symptoms and run an analysis',
              style: theme.textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => context.go('/symptoms'),
              icon: const Icon(Icons.arrow_back),
              label: const Text('Go Back'),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildAnalysisResults(BuildContext context, SymptomAnalysisResult result, WidgetRef ref) {
    final theme = Theme.of(context);
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header section with "Start New Check" button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Analysis Results',
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
              OutlinedButton.icon(
                onPressed: () {
                  // Clear symptoms and go back to symptom entry screen
                  ref.read(symptomStateProvider.notifier).clearSymptoms();
                  context.go('/symptoms');
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Start New Check'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: theme.colorScheme.primary,
                  side: BorderSide(color: theme.colorScheme.primary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Possible Conditions Section
          Text(
            'Possible Conditions',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          // Conditions List - Match screenshot styling
          ...result.possibleConditions.map((condition) {
            final confidencePercent = (condition.confidenceLevel * 100).round();
            final severityColor = _getSeverityColor(condition.severity, theme);
            
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(
                  color: theme.colorScheme.outline.withOpacity(0.2),
                  width: 1,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            condition.name,
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 2,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _getSeverityBackgroundColor(condition.severity, theme),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: severityColor.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            _getSeverityText(condition.severity),
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: severityColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      condition.description,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Confidence Level',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                    const SizedBox(height: 4),
                    LinearProgressIndicator(
                      value: condition.confidenceLevel,
                      backgroundColor: theme.colorScheme.surfaceVariant,
                      color: severityColor,
                      borderRadius: BorderRadius.circular(4),
                      minHeight: 8,
                    ),
                    const SizedBox(height: 4),
                    Align(
                      alignment: Alignment.centerRight,
                      child: Text(
                        '$confidencePercent%',
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: severityColor,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
          
          const SizedBox(height: 24),
          
          // Medical Assessment Section (NEW)
          // Only show if we have multiple conditions, which indicates a full analysis
          if (result.possibleConditions.length > 1) ...[
            Text(
              'Medical Assessment',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            Card(
              margin: const EdgeInsets.only(bottom: 16),
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(
                  color: theme.colorScheme.outline.withOpacity(0.2),
                  width: 1,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Overall Severity based on the most severe condition
                    Row(
                      children: [
                        Icon(
                          Icons.speed_rounded,
                          color: _getOverallSeverityColor(result, theme),
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Severity Assessment:',
                          style: theme.textTheme.titleSmall,
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _getOverallSeverityBackgroundColor(result, theme),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            _getOverallSeverityText(result),
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: _getOverallSeverityColor(result, theme),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Divider(),
                    
                    // Doctor Recommendation based on severity
                    Row(
                      children: [
                        Icon(
                          _shouldSeeDoctor(result) 
                              ? Icons.medical_services_rounded 
                              : Icons.healing_rounded,
                          color: _shouldSeeDoctor(result) 
                              ? Colors.red 
                              : Colors.green,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _shouldSeeDoctor(result)
                                ? 'Medical consultation recommended'
                                : 'No immediate medical consultation needed',
                            style: theme.textTheme.titleSmall?.copyWith(
                              color: _shouldSeeDoctor(result) 
                                  ? Colors.red 
                                  : Colors.green,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Divider(),
                    
                    // Specialist Recommendation
                    if (_shouldSeeDoctor(result)) ...[
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.person_rounded,
                            color: Colors.blue,
                            size: 24,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Recommended Specialist:',
                                  style: theme.textTheme.titleSmall,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _getSpecialistRecommendation(result),
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
          
          // Recommended Remedies Section
          Text(
            'Recommended Remedies',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          // Group remedies by type and show in collapsible sections
          _buildRemedySection(
            context,
            '🏠 Home Remedies',
            result.recommendedRemedies.where((r) => r.type == RemedyType.home).toList(),
            theme,
          ),
          
          _buildRemedySection(
            context,
            '💊 Over-The-Counter Medications', 
            result.recommendedRemedies.where((r) => r.type == RemedyType.otc).toList(),
            theme,
          ),
          
          _buildRemedySection(
            context,
            '👨‍⚕️ Professional Remedies',
            result.recommendedRemedies.where((r) => r.type == RemedyType.professional).toList(),
            theme,
          ),

          const SizedBox(height: 16),
          
          // Disclaimer
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: theme.colorScheme.outline.withOpacity(0.2),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  child: Icon(
                    Icons.info_outline, 
                    size: 20, 
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    result.disclaimer ?? 'This analysis is provided for informational purposes only and should not replace professional medical advice.',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Recent Symptom Checks Section
          _buildRecentChecksSection(context, ref, theme),
          
          const SizedBox(height: 24),
          
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    _consultAiAboutSymptoms(result, ref, context);
                  },
                  icon: const Icon(Icons.chat_outlined),
                  label: const Text('Discuss with AI'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: FilledButton.icon(
                  onPressed: () {
                    // Clear symptoms and go back to symptom entry screen
                    ref.read(symptomStateProvider.notifier).clearSymptoms();
                    context.go('/symptoms');
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('New Check'),
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  // Build collapsible remedy section
  Widget _buildRemedySection(
    BuildContext context, 
    String title, 
    List<Remedy> remedies,
    ThemeData theme,
  ) {
    if (remedies.isEmpty) return const SizedBox.shrink();
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: theme.colorScheme.outline.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: ExpansionTile(
        title: Text(
          title,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
        expandedCrossAxisAlignment: CrossAxisAlignment.start,
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        children: remedies.map((remedy) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                remedy.name,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                remedy.description,
                style: theme.textTheme.bodyMedium,
              ),
              if (remedy.warning != null) ...[
                const SizedBox(height: 4),
                Text(
                  'Warning: ${remedy.warning}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.red[700],
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
              const Divider(),
            ],
          ),
        )).toList(),
      ),
    );
  }
  
  // Build recent symptom checks section
  Widget _buildRecentChecksSection(BuildContext context, WidgetRef ref, ThemeData theme) {
    final historyAsync = ref.watch(symptomHistoryProvider);
    
    return historyAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, __) => const SizedBox.shrink(),
      data: (history) {
        if (history.isEmpty) return const SizedBox.shrink();
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    'Your Recent Symptom Checks',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                TextButton.icon(
                  onPressed: () {
                    ref.read(symptomHistoryProvider.notifier).clearHistory();
                  },
                  icon: const Icon(Icons.delete_outline, size: 16),
                  label: const Text('Clear History'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.red[700],
                    padding: EdgeInsets.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ...history.take(5).map((entry) {
              // Each entry is in format "id:timestamp"
              final parts = entry.split(':');
              if (parts.length != 2) return const SizedBox.shrink();
              
              final id = parts[0];
              final timestamp = DateTime.fromMillisecondsSinceEpoch(int.parse(parts[1]));
              
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: BorderSide(
                    color: theme.colorScheme.outline.withOpacity(0.2),
                    width: 1,
                  ),
                ),
                child: InkWell(
                  onTap: () {
                    // Navigate to this specific analysis result
                    context.go('/symptom-analysis/$id');
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            DateFormat.yMMMd().add_jm().format(timestamp),
                            style: theme.textTheme.bodyMedium?.copyWith(
                              fontWeight: FontWeight.w500,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.arrow_forward_ios,
                          size: 14,
                          color: theme.colorScheme.primary,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ],
        );
      },
    );
  }
  
  // Helper method to consult AI about symptoms
  void _consultAiAboutSymptoms(SymptomAnalysisResult result, WidgetRef ref, BuildContext context) {
    final symptoms = result.symptoms;
    if (symptoms.isEmpty) return;
    
    final formattedSymptoms = symptoms.map((s) {
      final severityText = _getSeverityText(s.severity);
      final durationText = '${s.durationValue} ${_getDurationText(s.duration, s.durationValue)}';
      return '${s.name} (Severity: $severityText, Duration: $durationText)';
    }).join('\n- ');
    
    // Add information about the analysis results
    final conditionsText = result.possibleConditions.map((c) {
      final confidencePercent = (c.confidenceLevel * 100).round();
      return '${c.name} (${_getSeverityText(c.severity)}, ${confidencePercent}% confidence): ${c.description}';
    }).join('\n- ');
    
    // Add medical assessment information using our helper methods
    String assessmentText = '';
    assessmentText += '\nOverall Severity: ${_getOverallSeverityText(result)}';
    assessmentText += '\nMedical Consultation Needed: ${_shouldSeeDoctor(result) ? "Yes" : "No"}';
    
    if (_shouldSeeDoctor(result)) {
      assessmentText += '\nRecommended Specialist: ${_getSpecialistRecommendation(result)}';
    }
    
    // Set the chat type to symptom checker
    ref.read(chatProvider.notifier).setChatType(ChatType.symptomChecker);
    
    // Format and send the symptoms to the AI
    final analysisText = '''
[SYMPTOM ANALYSIS CONSULTATION]

I received the following analysis results for my symptoms, and I'd like more information:

DIAGNOSED CONDITIONS:
- $conditionsText

REPORTED SYMPTOMS:
- $formattedSymptoms

MEDICAL ASSESSMENT:$assessmentText

Could you please provide more detailed information about:
1. These conditions and how they relate to my symptoms
2. Additional remedies or treatments I should consider
3. Lifestyle modifications that might help
4. When I should seek professional medical attention

Thank you for this follow-up health consultation.''';
    
    // Prepare the consultation
    ref.read(chatProvider.notifier).prepareSymptomConsultation(analysisText);
    
    // Navigate to chat screen
    context.go('/chat');
  }
  
  String _getSeverityText(SymptomSeverity severity) {
    switch (severity) {
      case SymptomSeverity.mild:
        return 'Mild';
      case SymptomSeverity.moderate:
        return 'Moderate';
      case SymptomSeverity.severe:
        return 'Severe';
      case SymptomSeverity.unbearable:
        return 'Emergency';
      default:
        return 'Unknown';
    }
  }
  
  String _getDurationText(SymptomDuration duration, int value) {
    switch (duration) {
      case SymptomDuration.minutes:
        return value == 1 ? 'Minute' : 'Minutes';
      case SymptomDuration.hours:
        return value == 1 ? 'Hour' : 'Hours';
      case SymptomDuration.days:
        return value == 1 ? 'Day' : 'Days';
      case SymptomDuration.weeks:
        return value == 1 ? 'Week' : 'Weeks';
      case SymptomDuration.months:
        return value == 1 ? 'Month' : 'Months';
      default:
        return '';
    }
  }
  
  Color _getSeverityColor(SymptomSeverity severity, ThemeData theme) {
    switch (severity) {
      case SymptomSeverity.mild:
        return Colors.green;
      case SymptomSeverity.moderate:
        return Colors.orange;
      case SymptomSeverity.severe:
        return Colors.red;
      case SymptomSeverity.unbearable:
        return Colors.purple;
      default:
        return theme.colorScheme.primary;
    }
  }
  
  Color _getSeverityBackgroundColor(SymptomSeverity severity, ThemeData theme) {
    switch (severity) {
      case SymptomSeverity.mild:
        return Colors.green.withOpacity(0.1);
      case SymptomSeverity.moderate:
        return Colors.orange.withOpacity(0.1);
      case SymptomSeverity.severe:
        return Colors.red.withOpacity(0.1);
      case SymptomSeverity.unbearable:
        return Colors.purple.withOpacity(0.1);
      default:
        return theme.colorScheme.primary.withOpacity(0.1);
    }
  }
  
  Color _getOverallSeverityColor(SymptomAnalysisResult result, ThemeData theme) {
    // Get the most severe condition from the list
    SymptomSeverity mostSevere = SymptomSeverity.mild;
    
    for (final condition in result.possibleConditions) {
      if (condition.severity.index > mostSevere.index) {
        mostSevere = condition.severity;
      }
    }
    
    return _getSeverityColor(mostSevere, theme);
  }
  
  Color _getOverallSeverityBackgroundColor(SymptomAnalysisResult result, ThemeData theme) {
    // Get the most severe condition from the list
    SymptomSeverity mostSevere = SymptomSeverity.mild;
    
    for (final condition in result.possibleConditions) {
      if (condition.severity.index > mostSevere.index) {
        mostSevere = condition.severity;
      }
    }
    
    return _getSeverityBackgroundColor(mostSevere, theme);
  }
  
  String _getOverallSeverityText(SymptomAnalysisResult result) {
    // Get the most severe condition from the list
    SymptomSeverity mostSevere = SymptomSeverity.mild;
    
    for (final condition in result.possibleConditions) {
      if (condition.severity.index > mostSevere.index) {
        mostSevere = condition.severity;
      }
    }
    
    return _getSeverityText(mostSevere);
  }
  
  bool _shouldSeeDoctor(SymptomAnalysisResult result) {
    // Check if any condition is severe or unbearable
    for (final condition in result.possibleConditions) {
      if (condition.severity == SymptomSeverity.severe || 
          condition.severity == SymptomSeverity.unbearable) {
        return true;
      }
      
      // Also check if any high confidence conditions (>70%)
      if (condition.confidenceLevel > 0.7 && 
          condition.severity == SymptomSeverity.moderate) {
        return true;
      }
    }
    
    // Check if there are any professional remedies recommended
    for (final remedy in result.recommendedRemedies) {
      if (remedy.type == RemedyType.professional) {
        return true;
      }
    }
    
    return false;
  }
  
  String _getSpecialistRecommendation(SymptomAnalysisResult result) {
    // Determine specialist based on conditions and their body regions
    Map<String, int> specialistScores = {
      'General Practitioner': 1, // Default recommendation
      'Dermatologist': 0,
      'Neurologist': 0,
      'Cardiologist': 0,
      'Gastroenterologist': 0,
      'Pulmonologist': 0,
      'Orthopedist': 0,
    };
    
    // Check symptoms for body regions to suggest specialists
    for (final symptom in result.symptoms) {
      switch (symptom.bodyRegion) {
        case BodyRegion.head:
          specialistScores['Neurologist'] = (specialistScores['Neurologist'] ?? 0) + 1;
          break;
        case BodyRegion.chest:
          specialistScores['Cardiologist'] = (specialistScores['Cardiologist'] ?? 0) + 1;
          specialistScores['Pulmonologist'] = (specialistScores['Pulmonologist'] ?? 0) + 1;
          break;
        case BodyRegion.abdomen:
          specialistScores['Gastroenterologist'] = (specialistScores['Gastroenterologist'] ?? 0) + 1;
          break;
        case BodyRegion.back:
        case BodyRegion.arms:
        case BodyRegion.legs:
          specialistScores['Orthopedist'] = (specialistScores['Orthopedist'] ?? 0) + 1;
          break;
        case BodyRegion.skin:
          specialistScores['Dermatologist'] = (specialistScores['Dermatologist'] ?? 0) + 1;
          break;
        default:
          specialistScores['General Practitioner'] = (specialistScores['General Practitioner'] ?? 0) + 1;
      }
    }
    
    // Find the specialist with the highest score
    String topSpecialist = 'General Practitioner';
    int highestScore = 0;
    
    specialistScores.forEach((specialist, score) {
      if (score > highestScore) {
        highestScore = score;
        topSpecialist = specialist;
      }
    });
    
    return topSpecialist;
  }
} 