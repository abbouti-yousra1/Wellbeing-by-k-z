import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Colors} from '../../constants/Colors.ts';
const Home = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/services');
        setServices(response.data);
      } catch (err) {
        setError('');
        // Fallback to static data from services.pdf
        setServices([
          { id: 1, name: 'Aromathérapie', description: 'Relax with essential oils', prices: { '1h': 50, '2h': 90, '3h': 120 }, imageUrl: '/images/aromatherapie.jpg' },
          { id: 2, name: 'Pressothérapie', description: 'Lymphatic drainage therapy', prices: { '1h': 45, '2h': 80, '3h': 110 }, imageUrl: '/images/pressotherapie.jpg' },
          { id: 3, name: 'Massage Relaxant', description: 'Gentle relaxation massage', prices: { '1h': 55, '2h': 95, '3h': 125 }, imageUrl: '/images/massage-relaxant.jpg' },
          { id: 4, name: 'Massage Tonifiant', description: 'Energizing muscle massage', prices: { '1h': 60, '2h': 100, '3h': 130 }, imageUrl: '/images/massage-tonifiant.jpg' },
          { id: 5, name: 'Massage Deep Tissue', description: 'Deep muscle relief', prices: { '1h': 65, '2h': 110, '3h': 140 }, imageUrl: '/images/massage-deep-tissue.jpg' },
        ]);
      }
    };
    fetchServices();
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <img src="/images/logo.png" alt="BKZ Logo" style={styles.logo} />
          <h1 style={styles.heroTitle}>Welcome to Wellbeing by K-Z</h1>
          <p style={styles.heroSubtitle}>Discover rejuvenating wellness sessions tailored for you</p>
          <a href="/register" style={styles.heroButton}>Book Now</a>
           <a href="/login" style={styles.heroButton}>Log In</a>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} style={styles.serviceCard}>
              <img
                src={service.imageUrl}
                alt={service.name}
                style={styles.serviceImage}
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
              />
              <h3 style={styles.serviceTitle}>{service.name}</h3>
              <p style={styles.serviceDescription}>{service.description}</p>
              <div style={styles.pricing}>
                {Object.entries(service.prices || {}).map(([duration, price]) => (
                  <p key={duration} style={styles.priceItem}>{duration}: ${price}</p>
                ))}
              </div>
              <a href="/register" style={styles.serviceButton}>Book Now</a>
            </div>
          ))}
        </div>
      </section>

        {/* About Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>About Us</h2>
        <div style={styles.aboutContainer}>
          <div style={styles.aboutText}>
            <p style={styles.sectionText}>
              At Wellbeing by K-Z, we are committed to transforming your wellness journey with exceptional care and expertise. Founded with a passion for holistic health, our team of certified therapists and wellness experts offers personalized sessions designed to relax, rejuvenate, and restore your body and mind. Nestled in state-of-the-art facilities, we combine traditional techniques with modern innovations to create a sanctuary of peace and healing.
            </p>
            <p style={styles.sectionText}>
              Our mission is to empower you to thrive through tailored wellness experiences, whether you're seeking relief from stress, muscle tension, or simply a moment of tranquility. With years of experience and a client-centered approach, we pride ourselves on delivering top-tier services that cater to your unique needs.
            </p>
          </div>
         
    <div style={styles.aboutImages}>
  <img src="/images/about1.jpg" alt="Wellness Facility" style={styles.aboutImage} onError={(e) => { e.target.src = '/images/placeholder.jpg'; }} />
  <img src="/images/about2.jpg" alt="Therapist at Work" style={styles.aboutImage} onError={(e) => { e.target.src = '/images/placeholder.jpg'; }} />
</div>
          
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ ...styles.section, backgroundColor: '#DCCFC0', padding: '48px 24px' }}>
        <h2 style={styles.sectionTitle}>Contact Us</h2>
        <p style={styles.sectionText}>
          Have questions or need assistance? Reach out to us!
        </p>
        <div style={styles.contactInfo}>
          <p style={styles.contactItem}> Email: <a href="mailto:info@wellbeingbykz.com" style={styles.contactLink}>info@wellbeingbykz.com</a></p>
          <p style={styles.contactItem}> Phone: +1-555-123-4567</p>
          <p style={styles.contactItem}> Address: 1 square Gustave flourens 91000 Évry Courcouronnes</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; 2025 Wellbeing by K-Z. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
          <a href="/terms" style={styles.footerLink}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', Arial, sans-serif",
    backgroundColor: Colors.softLavender, // Changed to soft pinkish-lavender for a subtle pink base
    color: Colors.textPrimary, // Updated to use defined text color
  },
  hero: {
    backgroundImage: 'url(/images/hero-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
  },
  heroContent: {
    backgroundColor: 'rgba(236, 213, 229, 0.6)', // Adjusted to softLavender with opacity for pinkish blur
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(30px)',
  },
  logo: {
    width: '150px',
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: Colors.deepPurple, // Changed to deepPurple for a bold pinkish-purple contrast
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: Colors.textSecondary, // Updated to secondary text color
    marginBottom: '24px',
  },
  heroButton: {
    display: 'inline-block',
    margin: '0 8px',
    padding: '12px 32px',
    backgroundColor: Colors.vibrantPlum, // Changed to vibrantPlum for a pinkish button
    color: '#FFFFFF', // White for better contrast
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  },
  section: {
    padding: '64px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: Colors.lightBg, // Light background for sections
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: Colors.deepPurple, // Changed to deepPurple for pinkish-purple headings
    textAlign: 'center',
    marginBottom: '40px',
  },
  sectionText: {
    fontSize: '18px',
    color: Colors.textSecondary, // Updated to secondary text color
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 24px',
  },
  error: {
    color: '#dc2626',
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF', // Kept white for contrast, but can use softLavender if desired
    borderRadius: '12px',
    boxShadow: `0 4px 12px ${Colors.lightGrey}`, // Updated with lightGrey for shadow
    overflow: 'hidden',
    transition: 'transform 0.3s',
  },
  serviceImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  serviceTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: Colors.vibrantPlum, // Changed to vibrantPlum for pinkish titles
    padding: '16px 24px 8px',
  },
  serviceDescription: {
    fontSize: '16px',
    color: Colors.textSecondary, // Updated to secondary text color
    padding: '0 24px 16px',
  },
  pricing: {
    padding: '0 24px 16px',
  },
  priceItem: {
    fontSize: '16px',
    color: Colors.textPrimary, // Kept primary text for readability
    margin: '4px 0',
  },
  serviceButton: {
    display: 'block',
    textAlign: 'center',
    padding: '12px',
    backgroundColor: Colors.vibrantPlum, // Changed to vibrantPlum for pinkish buttons
    color: '#FFFFFF', // White for contrast
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    margin: '16px 24px',
    transition: 'background-color 0.3s',
  },
  aboutContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '32px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutText: {
    flex: '1 1 60%',
    maxWidth: '600px',
  },
  aboutImages: {
    flex: '1 1 35%',
    display: 'flex',
    gap: '16px',
  },
  aboutImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: `0 4px 12px ${Colors.lightGrey}`, // Updated with lightGrey
  },
  contactInfo: {
    textAlign: 'center',
  },
  contactItem: {
    fontSize: '16px',
    color: Colors.textPrimary, // Updated to primary text color
    margin: '8px 0',
  },
  contactLink: {
    color: Colors.vibrantPlum, // Changed to vibrantPlum for pinkish links
    textDecoration: 'none',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: Colors.deepPurple, // Changed to deepPurple for a bold pinkish-purple footer
    color: '#FFFFFF', // White for contrast
    padding: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  footerText: {
    marginBottom: '8px',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  footerLink: {
    color: '#FFFFFF', // White for contrast
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
};
export default Home;