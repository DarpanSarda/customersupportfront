'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/theme-toggle/ThemeToggle'

const Page = () => {
  const { colors, theme } = useTheme()

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  const floatAnimation = {
    hidden: { y: 0 },
    visible: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center p-6 md:px-12 lg:px-20 sticky top-0 z-50"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(11, 12, 16, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.img
            src="/helpgenie-logo.svg"
            alt="HelpGenie Logo"
            width={40}
            height={40}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="text-2xl font-bold" style={{ color: colors.accent }}>
            HelpGenie
          </span>
        </motion.div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8">
            {['Features', 'How It Works', 'Pricing', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.button
              className="px-6 py-2 rounded-full font-semibold transition-all"
              style={{
                backgroundColor: colors.accent,
                color: theme === 'dark' ? '#0B0C10' : '#fff'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: colors.card }}>
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-block px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.1)',
                border: `1px solid ${colors.border}`
              }}
            >
              <span style={{ color: colors.accent }}>✨ Next-Gen Customer Support</span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ color: colors.text }}
            >
              Resolve Smarter, Not Harder
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              Transform your customer support with AI-powered resolution.
              Instant responses, intelligent routing, and seamless experiences.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <motion.button
                  className="px-8 py-4 rounded-full font-semibold text-lg transition-all"
                  style={{
                    backgroundColor: colors.accent,
                    color: theme === 'dark' ? '#0B0C10' : '#fff'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <motion.button
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all"
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid ${colors.accent}`,
                  color: colors.accent
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            { number: '99.9%', label: 'Uptime' },
            { number: '< 2s', label: 'Response Time' },
            { number: '50K+', label: 'Users' },
            { number: '4.9★', label: 'Rating' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                boxShadow: theme === 'dark' ? "0 0 30px rgba(20, 184, 166, 0.3)" : "0 10px 40px rgba(20, 184, 166, 0.1)",
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: colors.accent }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: index * 0.5,
                  ease: "easeInOut"
                }}
              >
                {stat.number}
              </motion.div>
              <div style={{ color: colors.text }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="container mx-auto px-6 md:px-12 lg:px-20 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
            Powerful Features
          </h2>
          <p className="text-xl" style={{ color: colors.accent }}>
            Everything you need to deliver exceptional support
          </p>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {[
            {
              icon: '🤖',
              title: 'AI-Powered Responses',
              description: 'Intelligent chatbot that understands context and provides accurate solutions instantly.'
            },
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Average response time under 2 seconds. No more frustrated customers waiting.'
            },
            {
              icon: '🎯',
              title: 'Smart Routing',
              description: 'Automatically route complex issues to the right human agents when needed.'
            },
            {
              icon: '📊',
              title: 'Analytics Dashboard',
              description: 'Gain insights with comprehensive analytics and reporting tools.'
            },
            {
              icon: '🌐',
              title: 'Multi-Channel',
              description: 'Seamless support across web, mobile, email, and social media platforms.'
            },
            {
              icon: '🔒',
              title: 'Enterprise Security',
              description: 'Bank-grade encryption and compliance with major security standards.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: theme === 'dark' ? "0 10px 40px rgba(20, 184, 166, 0.2)" : "0 10px 40px rgba(20, 184, 166, 0.1)",
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <motion.div
                className="text-4xl mb-4"
                animate={floatAnimation.visible}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.accent }}>
                {feature.title}
              </h3>
              <p style={{ color: colors.text }}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="container mx-auto px-6 md:px-12 lg:px-20 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
            How It Works
          </h2>
          <p className="text-xl" style={{ color: colors.accent }}>
            Get started in minutes, not months
          </p>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {[
            {
              step: '01',
              title: 'Integrate',
              description: 'Add our widget to your website with just a few lines of code.'
            },
            {
              step: '02',
              title: 'Customize',
              description: 'Train the AI with your knowledge base and brand guidelines.'
            },
            {
              step: '03',
              title: 'Launch',
              description: 'Go live and start providing exceptional customer support.'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="relative"
              variants={fadeInUp}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <motion.div
                className="text-8xl font-bold opacity-10 absolute -top-4 -left-2"
                style={{ color: colors.accent }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: theme === 'dark' ? [0.1, 0.15, 0.1] : [0.05, 0.1, 0.05]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
              >
                {item.step}
              </motion.div>
              <div className="relative z-10 pt-12">
                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.accent }}>
                  {item.title}
                </h3>
                <p style={{ color: colors.text }}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          className="rounded-3xl p-12 md:p-16 text-center"
          style={{
            backgroundColor: colors.card,
            border: `2px solid ${colors.border}`
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.text }}
            variants={fadeInUp}
          >
            Ready to Transform Your Support?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
            variants={fadeInUp}
          >
            Join thousands of businesses delivering exceptional customer experiences with AI-powered support.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
          >
            <Link href="/dashboard">
              <motion.button
                className="px-10 py-4 rounded-full font-semibold text-lg"
                style={{
                  backgroundColor: colors.accent,
                  color: theme === 'dark' ? '#0B0C10' : '#fff'
                }}
                variants={scaleIn}
                whileHover={{
                  scale: 1.05,
                  boxShadow: theme === 'dark' ? "0 0 30px rgba(20, 184, 166, 0.5)" : "0 10px 30px rgba(20, 184, 166, 0.2)",
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
            </Link>
            <motion.button
              className="px-10 py-4 rounded-full font-semibold text-lg"
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${colors.accent}`,
                color: colors.accent
              }}
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                boxShadow: theme === 'dark' ? "0 0 30px rgba(20, 184, 166, 0.3)" : "0 10px 30px rgba(20, 184, 166, 0.1)",
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="container mx-auto px-6 md:px-12 lg:px-20 py-12 border-t"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div
          className="grid md:grid-cols-4 gap-8 mb-8"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src="/helpgenie-logo.svg" alt="HelpGenie Logo" width={40} height={40} />
              <span className="text-2xl font-bold" style={{ color: colors.accent }}>HelpGenie</span>
            </motion.div>
            <p style={{ color: colors.text }}>Next-generation customer support for modern businesses.</p>
          </motion.div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Integrations'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] }
          ].map((section, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <h4 className="font-semibold mb-4" style={{ color: colors.accentSecondary }}>{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a href="#" className="hover:opacity-80" style={{ color: colors.text }}>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="text-center pt-8 border-t"
          style={{ borderColor: colors.border }}
          variants={fadeInUp}
        >
          <p style={{ color: colors.text }}>© 2025 HelpGenie. All rights reserved.</p>
        </motion.div>
      </motion.footer>
    </div>
  )
}

export default Page
