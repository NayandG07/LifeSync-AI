# LifeSync AI - Health & Wellness Companion

A comprehensive Flutter-based health and wellness application that combines AI-powered mental health support, health tracking, and medication management in one unified platform.

## 🌟 Features

### 🤖 AI-Powered Mental Health Support
- **AI Therapist Chat**: Get emotional support and guidance from an AI assistant trained in therapeutic techniques
- **Symptom Checker**: AI-powered symptom analysis and health assessment
- **Conversation History**: Track and manage your mental health conversations
- **Crisis Support**: Built-in safety measures and professional resource recommendations

### 📊 Health Tracking
- **Water Intake Monitoring**: Track daily hydration with visual progress indicators
- **Step Counting**: Monitor daily physical activity and movement
- **Sleep Tracking**: Record and analyze sleep patterns
- **Weight Management**: Track weight changes over time
- **Vital Signs**: Monitor heart rate, blood pressure, and blood glucose
- **Mood & Stress Tracking**: Log emotional well-being and stress levels
- **Custom Metrics**: Create personalized health tracking categories

### 💊 Medication Management
- **Medication Reminders**: Set up personalized medication schedules
- **Dosage Tracking**: Monitor medication intake and adherence
- **Refill Alerts**: Get notified when medications need refilling
- **Medication History**: Track medication logs and effectiveness
- **Multiple Schedules**: Support for complex medication regimens

### 🔗 Health Integrations
- **Health Connect**: Integration with Android Health Connect for seamless data sync
- **Device Compatibility**: Works with various health monitoring devices
- **Data Export**: Export health data for sharing with healthcare providers

### 🎨 User Experience
- **Modern UI**: Clean, intuitive interface with Material Design 3
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Responsive Design**: Optimized for various screen sizes
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Accessibility**: Built with accessibility best practices

## 🛠️ Technical Stack

### Frontend
- **Flutter**: Cross-platform mobile development framework
- **Dart**: Programming language for Flutter development
- **Riverpod**: State management and dependency injection
- **Go Router**: Declarative routing solution
- **Flutter Hooks**: React-like hooks for Flutter

### Backend & Services
- **Firebase**: Backend-as-a-Service platform
  - **Firebase Auth**: User authentication and management
  - **Cloud Firestore**: NoSQL database for data storage
  - **Firebase Storage**: File and media storage
- **Google Gemini AI**: AI-powered chat and symptom analysis
- **Google Sign-In**: Social authentication

### UI & Design
- **Material Design 3**: Modern design system
- **Flex Color Scheme**: Dynamic theming capabilities
- **Google Fonts**: Typography system
- **Lottie**: Animation support
- **Animate Do**: Animation utilities

### Development Tools
- **Freezed**: Code generation for data classes
- **JSON Annotation**: JSON serialization
- **Build Runner**: Code generation runner
- **Flutter Lints**: Code quality and style enforcement

## 📱 Supported Platforms

- **Android**: Full feature support with Health Connect integration
- **iOS**: Core functionality (Health Connect not available)
- **Web**: Basic functionality for web access
- **Windows**: Desktop application support
- **macOS**: Desktop application support
- **Linux**: Desktop application support

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (3.7.2 or higher)
- Dart SDK (included with Flutter)
- Android Studio / VS Code with Flutter extensions
- Firebase project setup
- Google Cloud Console access for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lifesyncaiapp.git
   cd lifesyncaiapp
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Download `google-services.json` and place it in `android/app/`
   - Configure Firebase for other platforms as needed

4. **Google AI Setup**
   - Get API keys from [Google AI Studio](https://aistudio.google.com)
   - Update API keys in `lib/app/constants.dart`

5. **Run the application**
   ```bash
   flutter run
   ```

### Configuration

1. **Update API Keys**
   ```dart
   // lib/app/constants.dart
   static const String chatbotApiKey = 'YOUR_GEMINI_API_KEY';
   static const String symptomCheckerApiKey = 'YOUR_SYMPTOM_CHECKER_API_KEY';
   ```

2. **Firebase Rules**
   - Configure Firestore security rules for your use case
   - Set up authentication providers in Firebase Console

3. **Platform-specific Setup**
   - **Android**: Configure Health Connect permissions
   - **iOS**: Set up HealthKit integration (if needed)
   - **Web**: Configure Firebase for web

## 📁 Project Structure

```
lib/
├── app/                    # App configuration and constants
├── data/                   # Data sources and repositories
├── models/                 # Data models and entities
├── providers/              # Riverpod state management
├── screens/                # UI screens and pages
├── services/               # Business logic and API services
├── utils/                  # Utility functions and helpers
├── widgets/                # Reusable UI components
└── main.dart              # Application entry point
```

## 🔧 Development

### Code Generation
Run code generation for models and providers:
```bash
flutter packages pub run build_runner build
```

### Testing
Run tests:
```bash
flutter test
```

### Building for Production
```bash
# Android
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

## 📊 Health Metrics

The app tracks various health metrics including:

- **Water Intake**: Daily hydration goals (default: 2000ml)
- **Steps**: Physical activity tracking (default: 10,000 steps)
- **Sleep**: Sleep duration monitoring (recommended: 7-9 hours)
- **Weight**: Body weight tracking
- **Heart Rate**: Cardiovascular monitoring
- **Blood Pressure**: Cardiovascular health tracking
- **Blood Glucose**: Diabetes management support
- **Mood**: Emotional well-being assessment (1-5 scale)
- **Stress**: Stress level monitoring (1-5 scale)

## 🤖 AI Features

### Chat Types
1. **Therapist Chat**: Mental health support and emotional guidance
2. **Symptom Checker**: Health assessment and symptom analysis

### AI Capabilities
- Natural language processing for health conversations
- Contextual understanding of health-related queries
- Safety measures and crisis intervention
- Evidence-based health recommendations
- Personalized responses based on user history

## 🔒 Privacy & Security

- **Data Encryption**: All data is encrypted in transit and at rest
- **User Privacy**: Personal health data is never shared without consent
- **Secure Authentication**: Firebase Auth with multiple providers
- **Local Storage**: Sensitive data stored securely on device
- **HIPAA Considerations**: Designed with healthcare privacy in mind

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the troubleshooting guide

## 🗺️ Roadmap

- [ ] Apple HealthKit integration
- [ ] Wearable device support
- [ ] Advanced analytics and insights
- [ ] Healthcare provider integration
- [ ] Telemedicine features
- [ ] Multi-language support
- [ ] Offline mode support

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- Firebase team for backend services
- Google AI for Gemini integration
- Open source community for various packages
- Healthcare professionals for domain expertise

---

**Disclaimer**: This app is for informational and educational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
