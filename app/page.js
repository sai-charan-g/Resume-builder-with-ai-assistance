import Link from 'next/link';
import { ArrowRight, FileText, Sparkles, Download } from 'lucide-react';
import ContactSection from '@/components/ContactSection';
import styles from './page.module.css';

export const metadata = {
  title: 'AI Resume Builder - Professional & Premium Resumes',
  description: 'Build your professional resume in minutes using AI. Export to PDF and land your dream job.',
};

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.heroSection}`}>
        <div className={`glass glass-panel animate-slide-up ${styles.heroCard}`}>
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>AI-Powered Resume Generation</span>
          </div>
          
          <h1 className={styles.title}>
            Craft Your <span className={styles.highlight}>Professional</span> Resume in Minutes
          </h1>
          
          <p className={styles.subtitle}>
            Stand out from the crowd with our premium, AI-enhanced resume builder. 
            Perfectly formatted, ATS-friendly, and designed to land you interviews.
          </p>
          
          <div className={styles.ctaGroup}>
            <Link href="/register" className="btn-primary">
              Get Started for Free <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          <div className={`glass glass-panel animate-slide-up delay-100 ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Sparkles size={24} className={styles.icon} />
            </div>
            <h3>AI Enhancement</h3>
            <p>Our AI integration polishes your bullet points and suggests impactful action verbs.</p>
          </div>
          
          <div className={`glass glass-panel animate-slide-up delay-200 ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <FileText size={24} className={styles.icon} />
            </div>
            <h3>Live Preview</h3>
            <p>See your changes instantly. What you see is exactly what employers get.</p>
          </div>
          
          <div className={`glass glass-panel animate-slide-up delay-300 ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Download size={24} className={styles.icon} />
            </div>
            <h3>PDF Export</h3>
            <p>Download a perfectly pixel-aligned PDF with one click. 100% ATS friendly.</p>
          </div>
        </div>

        <ContactSection />
      </div>
    </main>
  );
}
