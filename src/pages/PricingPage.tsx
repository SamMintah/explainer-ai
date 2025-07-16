import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

interface PricingPageProps {
  setCurrentPage: (page: Page) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ setCurrentPage }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out the platform',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '3 explainer videos per month',
        'Up to 5 minutes per video',
        'Basic voice selection',
        'Standard video quality',
        'Email support',
        'Watermark on videos'
      ],
      limitations: [
        'Limited to 3 videos/month',
        'Watermark included',
        'Basic features only'
      ],
      buttonText: 'Start Free',
      buttonStyle: 'border-2 border-purple-200 text-purple-600 hover:bg-purple-50',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals and content creators',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        '50 explainer videos per month',
        'Up to 15 minutes per video',
        'Premium voice library (8 voices)',
        'HD video quality',
        'Custom branding',
        'No watermark',
        'Priority support',
        'Advanced editing tools',
        'Export to multiple formats'
      ],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For teams and organizations',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Unlimited explainer videos',
        'Up to 30 minutes per video',
        'Full voice library (15+ voices)',
        '4K video quality',
        'Team collaboration',
        'Custom branding & templates',
        'API access',
        'Dedicated support',
        'Analytics dashboard',
        'Bulk processing',
        'White-label options'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
    },
    {
      question: "What happens to my videos if I downgrade?",
      answer: "All your existing videos remain accessible. However, you'll be limited to your new plan's monthly video creation limits going forward."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Can I use my own branding?",
      answer: "Custom branding is available on Pro and Business plans. You can add your logo, colors, and remove our watermark."
    },
    {
      question: "Is there an API available?",
      answer: "Yes! API access is included with Business plans. You can integrate our explainer generation directly into your applications."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF, DOCX, TXT files, and direct URL input. Videos can be exported in MP4, MOV, and WebM formats."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Background Animation Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-30 animate-float-slow"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-blue-200 rounded-full opacity-15 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, transparent
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> pricing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Start free, upgrade when you're ready.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="ml-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  } ${hoveredPlan === plan.id ? 'transform -translate-y-1' : ''}`}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                      </span>
                      <span className="text-gray-600 ml-1">
                        /{billingCycle === 'monthly' ? 'month' : 'month'}
                      </span>
                      {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          ${plan.yearlyPrice} billed annually
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentPage('signup')}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${plan.buttonStyle}`}
                    >
                      {plan.buttonText}
                    </button>

                    <ul className="mt-8 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Compare all features
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-900">Pro</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-900">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Videos per month</td>
                    <td className="py-4 px-6 text-center text-gray-600">3</td>
                    <td className="py-4 px-6 text-center text-gray-600">50</td>
                    <td className="py-4 px-6 text-center text-gray-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Max video length</td>
                    <td className="py-4 px-6 text-center text-gray-600">5 min</td>
                    <td className="py-4 px-6 text-center text-gray-600">15 min</td>
                    <td className="py-4 px-6 text-center text-gray-600">30 min</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Voice options</td>
                    <td className="py-4 px-6 text-center text-gray-600">3</td>
                    <td className="py-4 px-6 text-center text-gray-600">8</td>
                    <td className="py-4 px-6 text-center text-gray-600">15+</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Video quality</td>
                    <td className="py-4 px-6 text-center text-gray-600">Standard</td>
                    <td className="py-4 px-6 text-center text-gray-600">HD</td>
                    <td className="py-4 px-6 text-center text-gray-600">4K</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Custom branding</td>
                    <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">API access</td>
                    <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Team collaboration</td>
                    <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently asked questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your content?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Start creating engaging explainer videos today. No credit card required.
            </p>
            <button
              onClick={() => setCurrentPage('signup')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-lg"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
