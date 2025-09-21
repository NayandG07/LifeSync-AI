import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

import '../../app/constants.dart';
import '../../data/symptom_data.dart';
import '../../models/symptom/symptom_model.dart';
import '../../providers/symptom/symptom_provider.dart';
import '../../services/symptom/symptom_analysis_service.dart';
import '../../widgets/common/app_bar.dart';
import '../../widgets/common/bottom_nav_bar.dart';
import '../../widgets/common/loading_indicator.dart';
import '../../providers/chat/chat_provider.dart';

/// Symptom category model
class SymptomCategory {
  /// Constructor
  const SymptomCategory({
    required this.name,
    required this.icon,
    required this.symptoms,
  });
  
  /// Category name
  final String name;
  
  /// Category icon
  final IconData icon;
  
  /// List of symptoms in this category
  final List<String> symptoms;
}

/// Selected symptom provider
final selectedSymptomsProvider = StateProvider<List<String>>((ref) => []);

/// Symptom checker screen
class SymptomsScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const SymptomsScreen({super.key});
  
  @override
  ConsumerState<SymptomsScreen> createState() => _SymptomsScreenState();
}

class _SymptomsScreenState extends ConsumerState<SymptomsScreen> {
  final TextEditingController _symptomController = TextEditingController();
  bool _isAnalyzing = false;
  
  @override
  void dispose() {
    _symptomController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Symptoms',
      ),
      body: _buildSymptomContent(context),
      bottomNavigationBar: const LifeSyncBottomNavBar(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isAnalyzing ? null : _analyzeSymptoms,
        label: _isAnalyzing 
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2,
                ),
              )
            : const Text('Analyze Symptoms'),
        icon: _isAnalyzing ? null : const Icon(Icons.analytics),
      ),
    );
  }
  
  Widget _buildSymptomContent(BuildContext context) {
    final theme = Theme.of(context);
    final symptoms = ref.watch(symptomStateProvider);
    final selectedRegion = ref.watch(bodyRegionFilterProvider);
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppConstants.mediumPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // "Quick symptoms selection" section with body region filter chips
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Quick symptoms selection:',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Row(
                  children: [
                    ChoiceChip(
                      label: const Text('All'),
                      selected: selectedRegion == null,
                      onSelected: (selected) {
                        if (selected) {
                          ref.read(bodyRegionFilterProvider.notifier).setRegion(null);
                        }
                      },
                    ),
                    const SizedBox(width: 4),
                    InkWell(
                      onTap: () {
                        ref.read(symptomStateProvider.notifier).clearSymptoms();
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Row(
                          children: [
                            const Icon(Icons.clear, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              'Clear all',
                              style: theme.textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Body region filter chips
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: BodyRegion.values.map((region) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: FilterChip(
                    label: Text(SymptomData.getNameForBodyRegion(region)),
                    selected: selectedRegion == region,
                    avatar: Icon(
                      SymptomData.getIconForBodyRegion(region),
                      size: 18,
                    ),
                    onSelected: (selected) {
                      ref.read(bodyRegionFilterProvider.notifier).setRegion(
                        selected ? region : null,
                      );
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Symptom chips based on selected region
          _buildSymptomSelectionGrid(context),
          
          const SizedBox(height: 24),
          
          // "Your symptoms:" section
          Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: theme.colorScheme.outline.withOpacity(0.5),
              ),
              borderRadius: BorderRadius.circular(AppConstants.mediumBorderRadius),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Your symptoms:',
                        style: theme.textTheme.titleMedium,
                      ),
                      if (symptoms.isNotEmpty)
                        IconButton(
                          icon: const Icon(Icons.refresh_outlined, size: 16),
                          tooltip: 'Reset symptoms',
                          onPressed: () {
                            ref.read(symptomStateProvider.notifier).clearSymptoms();
                          },
                        ),
                    ],
                  ),
                ),
                if (symptoms.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'No symptoms added yet',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  )
                else
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: symptoms.map((symptom) {
                        return Chip(
                          label: Text(symptom.name),
                          deleteIcon: const Icon(Icons.close, size: 16),
                          onDeleted: () {
                            ref.read(symptomStateProvider.notifier).removeSymptom(symptom.id);
                          },
                        );
                      }).toList(),
                    ),
                  ),
                
                // Symptom details (only shown when symptoms are selected)
                if (symptoms.isNotEmpty) ...[
                  const Divider(),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: symptoms.map((symptom) {
                        return _buildSymptomDetailItem(context, symptom);
                      }).toList(),
                    ),
                  ),
                ],
              ],
            ),
          ),
          
          // Add a "Consult AI" button as an alternative to the analyze button
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: symptoms.isEmpty ? null : _consultAIAboutSymptoms,
              icon: const Icon(Icons.chat),
              label: const Text('Consult AI about these symptoms'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildSymptomSelectionGrid(BuildContext context) {
    final selectedRegion = ref.watch(bodyRegionFilterProvider);
    
    // Get symptoms based on the selected region or all symptoms if no region selected
    final List<String> availableSymptoms = selectedRegion != null
        ? SymptomData.getSymptomsByBodyRegion(selectedRegion)
        : SymptomData.getAllSymptoms();
    
    // Display the symptoms in a grid
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 3.0,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: availableSymptoms.length,
      itemBuilder: (context, index) {
        final symptomName = availableSymptoms[index];
        
        // Check if this symptom is already selected
        final isSelected = ref.watch(symptomStateProvider)
            .any((s) => s.name.toLowerCase() == symptomName.toLowerCase());
        
        return OutlinedButton(
          onPressed: () {
            if (isSelected) {
              // Find the symptom ID and remove it
              final symptomId = ref.read(symptomStateProvider)
                  .firstWhere((s) => s.name.toLowerCase() == symptomName.toLowerCase())
                  .id;
              ref.read(symptomStateProvider.notifier).removeSymptom(symptomId);
            } else {
              // Add the symptom
              ref.read(symptomStateProvider.notifier).addSymptom(
                symptomName,
                bodyRegion: selectedRegion,
              );
            }
          },
          style: OutlinedButton.styleFrom(
            backgroundColor: isSelected
                ? Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3)
                : null,
            side: BorderSide(
              color: isSelected 
                  ? Theme.of(context).colorScheme.primary 
                  : Theme.of(context).colorScheme.outline,
              width: isSelected ? 2.0 : 1.0,
            ),
          ),
          child: Text(
            symptomName,
            textAlign: TextAlign.center,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: isSelected 
                  ? Theme.of(context).colorScheme.primary 
                  : Theme.of(context).colorScheme.onSurface,
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildSymptomDetailItem(BuildContext context, Symptom symptom) {
    final theme = Theme.of(context);
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            symptom.name,
            style: theme.textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
          
          // Severity slider
          Row(
            children: [
              const Text('Severity:'),
              Expanded(
                child: Slider(
                  value: symptom.severity.index.toDouble(),
                  min: 0,
                  max: SymptomSeverity.values.length - 1,
                  divisions: SymptomSeverity.values.length - 1,
                  label: _getSeverityText(symptom.severity),
                  onChanged: (value) {
                    ref.read(symptomStateProvider.notifier).updateSymptomSeverity(
                      symptom.id,
                      SymptomSeverity.values[value.toInt()],
                    );
                  },
                ),
              ),
              Text(_getSeverityText(symptom.severity)),
            ],
          ),
          
          // Duration selection
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Duration:'),
              const SizedBox(width: 8),
              Flexible(
                child: DropdownButton<int>(
                  value: symptom.durationValue,
                  items: List.generate(30, (i) => i + 1)
                      .map((v) => DropdownMenuItem(value: v, child: Text('$v')))
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      ref.read(symptomStateProvider.notifier).updateSymptomDuration(
                        symptom.id,
                        symptom.duration,
                        value,
                      );
                    }
                  },
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: DropdownButton<SymptomDuration>(
                  value: symptom.duration,
                  items: SymptomDuration.values
                      .map((d) => DropdownMenuItem(
                          value: d,
                          child: Text(_getDurationText(d, symptom.durationValue)),
                        ))
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      ref.read(symptomStateProvider.notifier).updateSymptomDuration(
                        symptom.id,
                        value,
                        symptom.durationValue,
                      );
                    }
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  // Helper methods
  
  String _getSeverityText(SymptomSeverity severity) {
    switch (severity) {
      case SymptomSeverity.mild:
        return 'Mild';
      case SymptomSeverity.moderate:
        return 'Moderate';
      case SymptomSeverity.severe:
        return 'Severe';
      case SymptomSeverity.unbearable:
        return 'Unbearable';
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
  
  Future<void> _analyzeSymptoms() async {
    final symptoms = ref.read(symptomStateProvider);
    if (symptoms.isEmpty) {
      // Show message that symptoms are required
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one symptom to analyze')),
      );
      return;
    }
    
    // Don't allow starting a new analysis if one is already in progress
    if (_isAnalyzing) return;

    setState(() {
      _isAnalyzing = true;
    });
    
    try {
      // Show a loading dialog for better UX
      if (context.mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return const AlertDialog(
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Analyzing symptoms...\nThis may take a moment.'),
                ],
              ),
            );
          },
        );
      }
      
      print('Starting symptom analysis for ${symptoms.length} symptoms');
      
      // Get the analysis service directly
      final analysisService = ref.read(symptomAnalysisServiceProvider);
      
      // Perform the analysis directly with the service
      final result = await analysisService.analyzeSymptoms(symptoms);
      
      // Store result in provider
      final notifier = ref.read(symptomAnalysisResultNotifierProvider.notifier);
      await notifier.analyzeSymptoms(symptoms);
      
      // Close loading dialog if it's still showing
      if (context.mounted && Navigator.of(context).canPop()) {
        Navigator.of(context).pop();
      }
      
      // Add a small delay to ensure all state updates have completed
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Use saved result for navigation to avoid state issues
      if (context.mounted) {
        print('Analysis successful, navigating to results screen with direct result');
        
        try {
          // Force update of provider with result before navigation
          await ref.read(symptomAnalysisResultNotifierProvider.notifier).forceUpdateWithResult(result);
          
          // Small delay to ensure result is stored
          await Future.delayed(const Duration(milliseconds: 200));
          
          // Navigate to analysis screen
          if (context.mounted) {
            // Navigate using go instead of push
            context.go('/symptom-analysis/latest');
            print('Navigation to symptom analysis screen successful');
          }
        } catch (e) {
          print('Error with navigation: $e');
          // Fallback - show result directly
          if (context.mounted) {
            _showAnalysisResultDirectly(context, result);
          }
        }
      }
    } catch (e) {
      print('Exception during symptom analysis: $e');
      
      // Close loading dialog if it's still showing
      if (context.mounted && Navigator.of(context).canPop()) {
        Navigator.of(context).pop();
      }
      
      if (context.mounted) {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error analyzing symptoms: $e'),
            duration: const Duration(seconds: 6),
            action: SnackBarAction(
              label: 'Try Again',
              onPressed: _analyzeSymptoms,
            ),
          ),
        );
      }
    } finally {
      // Reset analyzing state if still mounted
      if (mounted) {
        setState(() {
          _isAnalyzing = false;
        });
      }
    }
  }
  
  // Helper method to show analysis result directly if navigation fails
  void _showAnalysisResultDirectly(BuildContext context, SymptomAnalysisResult result) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Symptom Analysis Result'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Possible Conditions:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ...result.possibleConditions.map((condition) {
                final confidencePercent = (condition.confidenceLevel * 100).round();
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${condition.name} (${_getSeverityText(condition.severity)}, $confidencePercent% confidence)',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text(condition.description),
                    ],
                  ),
                );
              }).toList(),
              const SizedBox(height: 16),
              const Text('Recommended Remedies:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ...result.recommendedRemedies.map((remedy) => Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(remedy.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(remedy.description),
                  ],
                ),
              )).toList(),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _consultAIAboutSymptoms();
            },
            child: const Text('Discuss with AI'),
          ),
        ],
      ),
    );
  }
  
  void _consultAIAboutSymptoms() {
    final symptoms = ref.read(symptomStateProvider);
    if (symptoms.isEmpty) return;
    
    final formattedSymptoms = symptoms.map((s) {
      final severityText = _getSeverityText(s.severity);
      final durationText = '${s.durationValue} ${_getDurationText(s.duration, s.durationValue)}';
      return '${s.name} (Severity: $severityText, Duration: $durationText)';
    }).join('\n- ');
    
    // Set the chat type for proper context
    ref.read(chatProvider.notifier).setChatType(ChatType.symptomChecker);
    
    // Format the symptoms with clear context for the chat
    final symptomsText = '''
[SYMPTOM CONSULTATION]

I'd like to discuss these health symptoms with you:
- $formattedSymptoms

Could you help me understand what might be causing them? Please provide:
1. Potential conditions these symptoms might indicate
2. Home remedies or self-care options that might help
3. When I should consider seeing a doctor
4. Any lifestyle changes that might improve my condition

Thank you for your assistance with this health consultation.''';
    
    // Prepare the consultation and navigate to chat
    ref.read(chatProvider.notifier).prepareSymptomConsultation(symptomsText);
    context.go('/chat');
  }
} 