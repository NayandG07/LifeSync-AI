
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <section className="text-center mb-12 md:mb-16 animate-reveal">
        <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Privacy Policy</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Your privacy is important to us at LifeSync AI.
        </p>
      </section>

      <section className="prose prose-lg max-w-3xl mx-auto text-foreground/90 animate-reveal" style={{animationDelay: '100ms'}}>
        <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to LifeSync AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at lifesync.help@gmail.com.
        </p>
        <p>
          This privacy notice describes how we might use your information if you:
        </p>
        <ul>
          <li>Download and use our mobile application — LifeSync AI</li>
          <li>Engage with us in other related ways ― including any sales, marketing, or events</li>
        </ul>
        <p>In this privacy notice, if we refer to:
        </p>
        <ul>
          <li><strong>"App,"</strong> we are referring to our application, LifeSync AI.</li>
          <li><strong>"Services,"</strong> we are referring to our App, and other related services, including any sales, marketing, or events.</li>
        </ul>
        <p>
          The purpose of this privacy notice is to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          <strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and Services, when you participate in activities on the App or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and the App, the choices you make and the products and features you use. The personal information we collect may include the following: names, email addresses, health information (such as symptoms, water intake, medication details, height, weight, age, activity level), and other similar information.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        <ul>
          <li>To facilitate account creation and logon process.</li>
          <li>To provide and improve our App features (e.g., AI Chatbot, Symptom Checker, Water Tracker).</li>
          <li>To send administrative information to you.</li>
          <li>To respond to your inquiries and solve any potential issues you might have with the use of our Services.</li>
          <li>For other business purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our App, products, marketing and your experience.</li>
        </ul>
        
        <h2>4. Will Your Information Be Shared With Anyone?</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
        </p>
        
        <h2>5. How Long Do We Keep Your Information?</h2>
        <p>
          We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
        </p>

        <h2>6. How Do We Keep Your Information Safe?</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.
        </p>

        <h2>7. What Are Your Privacy Rights?</h2>
        <p>
          In some regions (like the EEA and UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
        </p>

        <h2>8. Updates To This Notice</h2>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
        </p>

        <h2>9. How Can You Contact Us About This Notice?</h2>
        <p>
          If you have questions or comments about this notice, you may email us at lifesync.help@gmail.com.
        </p>
      </section>
    </div>
  );
}
