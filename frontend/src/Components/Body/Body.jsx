import "./Body.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faArrowRight, faStar, faChartBar, faComments, faChartLine, faClock, faShield, faUsers, faBrain, faCheckCircle, faGlobe, faRocket, faBuilding, faHospital, faStore, faUtensils, faCrown, faMedal, faGift, faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export default function Body(){
    const navigate = useNavigate();
    
    const businessCategories = [
        { id: "medical", name: "Medical", icon: faHospital, description: "Healthcare & Medical Services", color: "#10B981" },
        { id: "ecommerce", name: "E-commerce", icon: faStore, description: "Online Shopping & Retail", color: "#3B82F6" },
        { id: "restaurant", name: "Restaurant", icon: faUtensils, description: "Food & Hospitality", color: "#F59E0B" }
    ];

    const handleCategoryClick = (categoryId) => {
        navigate(`/feedback?category=${categoryId}`);
    };

    const features = [
        { icon: faMicrophone, title: "Natural Customer Conversations", desc: "Your customers speak naturally while our AI captures their feedback in real-time." },
        { icon: faChartBar, title: "Real-Time Analytics Dashboard", desc: "See customer sentiment, top issues, and improvement areas instantly in your dashboard." },
        { icon: faComments, title: "Deep Customer Insights", desc: "Understand not just what customers say, but why they feel that way through AI-powered analysis." },
        { icon: faChartLine, title: "Actionable Improvement Plans", desc: "Get specific recommendations on what to fix first based on customer feedback patterns." },
        { icon: faClock, title: "Higher Response Rates", desc: "Voice feedback is faster and more engaging than surveys, so more customers actually respond." },
        { icon: faShield, title: "Secure & Private", desc: "All customer feedback is encrypted and protected with enterprise-grade security." }
    ];

    const stats = [
        { value: "100+", label: "Business Categories", icon: faBuilding },
        { value: "AI-Powered", label: "Insights Engine", icon: faBrain },
        { value: "Real-Time", label: "Analytics Dashboard", icon: faChartBar },
        { value: "100%", label: "Free to Use", icon: faStar }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Business Owner",
            company: "TechCorp",
            text: "We finally understand what our customers really think. The actionable insights helped us fix our top 3 pain points in just one week!",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Restaurant Owner",
            company: "DesignStudio",
            text: "Our customers love the voice feedback - it's so much easier than filling out forms. We get 3x more responses and real insights we can act on.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "E-commerce Founder",
            company: "StartupXYZ",
            text: "The dashboard shows us exactly what to improve. We've seen a 40% increase in customer satisfaction since using survAI to gather feedback.",
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: "Free",
            icon: faGift,
            price: "$0",
            users: "Up to 400 users",
            features: [
                "Voice & Text Feedback",
                "Basic Analytics Dashboard",
                "Sentiment Analysis",
                "Top Feedback Themes",
                "Email Support"
            ],
            color: "#6366F1",
            popular: false
        },
        {
            name: "Silver",
            icon: faMedal,
            price: "$300",
            users: "Up to 10,000 users",
            features: [
                "Everything in Free",
                "Advanced Analytics",
                "Priority Support",
                "Custom Integrations",
                "Export Reports",
                "API Access"
            ],
            color: "#8B5CF6",
            popular: true
        },
        {
            name: "Gold",
            icon: faCrown,
            price: "Custom",
            users: "Up to 10,000,000 users",
            features: [
                "Everything in Silver",
                "Dedicated Account Manager",
                "White-label Options",
                "Custom AI Training",
                "SLA Guarantee",
                "24/7 Priority Support",
                "Advanced Security"
            ],
            color: "#F59E0B",
            popular: false
        }
    ];

    return(
        <div className="body-container">
            {/* Hero Section */}
            <section id="hero" className="hero-section">
                <div className="hero-content-wrapper">
                    <div className="hero-left">
                        <div className="hero-badge">
                            <FontAwesomeIcon icon={faStar} className="sparkle-icon" />
                            <span>AI-Powered Customer Feedback Platform</span>
                        </div>
                        <h1 className="hero-title">
                            <span className="title-line-1">Get Real Customer Feedback &</span>
                            <span className="title-line-2">
                                <span className="word-voice">Actionable</span>
                                <span className="word-intelligence">Insights</span>
                            </span>
                        </h1>
                        <p className="hero-description">
                            Help your customers share honest feedback through natural voice conversations. 
                            Get AI-powered insights that show you exactly what to improve and how to grow your business.
                        </p>
                        <div className="hero-actions">
                            <button 
                                className="btn-primary-action"
                                onClick={() => {
                                    const element = document.getElementById('popular-business-categories');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                <div className="btn-icon-wrapper">
                                    <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
                                </div>
                                <span className="btn-text">Get Started</span>
                                <div className="btn-shine"></div>
                            </button>
                            <button 
                                className="btn-demo-action"
                                onClick={() => navigate('/shop/login')}
                            >
                                <span className="btn-text">Demo</span>
                            </button>
                        </div>
                        <div className="hero-stats-mini">
                            <div className="stat-mini">
                                <div className="stat-mini-icon-wrapper">
                                    <div className="stat-mini-icon-bg"></div>
                                    <FontAwesomeIcon icon={faBuilding} className="stat-mini-icon" />
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">
                                        <span className="stat-number">100</span>
                                        <span className="stat-plus">+</span>
                                    </div>
                                    <div className="stat-mini-label">Categories</div>
                                </div>
                                <div className="stat-glow"></div>
                            </div>
                            <div className="stat-mini">
                                <div className="stat-mini-icon-wrapper">
                                    <div className="stat-mini-icon-bg"></div>
                                    <FontAwesomeIcon icon={faMicrophone} className="stat-mini-icon" />
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">
                                        <span className="stat-number">AI</span>
                                    </div>
                                    <div className="stat-mini-label">Powered</div>
                                </div>
                                <div className="stat-glow"></div>
                            </div>
                            <div className="stat-mini">
                                <div className="stat-mini-icon-wrapper">
                                    <div className="stat-mini-icon-bg"></div>
                                    <FontAwesomeIcon icon={faClock} className="stat-mini-icon" />
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">
                                        <span className="stat-number">Real</span>
                                    </div>
                                    <div className="stat-mini-label">Time</div>
                                </div>
                                <div className="stat-glow"></div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-right">
                        <div className="phone-mockup">
                            <div className="phone-frame">
                                <div className="phone-screen">
                                    <div className="screen-header">
                                        <div className="status-bar">
                                            <span>9:41</span>
                                            <div className="status-icons">
                                                <span>📶</span>
                                                <span>📶</span>
                                                <span>🔋</span>
                                            </div>
                                        </div>
                                        <div className="app-header">
                                            <h3>Voice Feedback</h3>
                                            <div className="header-wave"></div>
                                        </div>
                                    </div>
                                    <div className="screen-content">
                                        <div className="voice-card">
                                            <div className="voice-icon-large">
                                                <FontAwesomeIcon icon={faMicrophone} />
                                            </div>
                                            <h4>Start Your Feedback</h4>
                                            <p>Tap the microphone and speak naturally about your experience</p>
                                            <div className="voice-indicators">
                                                <div className="indicator"></div>
                                                <div className="indicator"></div>
                                                <div className="indicator"></div>
                                            </div>
                                        </div>
                                        <div className="feedback-preview">
                                            <div className="preview-item">
                                                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                                                <span>Real-time Analysis</span>
                                            </div>
                                            <div className="preview-item">
                                                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                                                <span>Sentiment Detection</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="screen-footer">
                                        <div className="nav-tabs">
                                            <div className="tab active">Home</div>
                                            <div className="tab">Feedback</div>
                                            <div className="tab">Analytics</div>
                                            <div className="tab">Profile</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-icon-box">
                                <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Why Business Owners Choose survAI</h2>
                        <p className="section-subtitle">Get honest customer feedback and clear insights to improve your business</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Business Categories Section - Above How It Works */}
            <section id="popular-business-categories" className="business-categories-section" style={{ padding: "80px 0", background: "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)" }}>
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Perfect for Your Business Type</h2>
                        <p className="section-subtitle">Get industry-specific feedback insights tailored to your business</p>
                    </div>
                    <div className="business-categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", marginTop: "50px" }}>
                        {businessCategories.map((category) => (
                            <div 
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                style={{
                                    background: "white",
                                    borderRadius: "20px",
                                    padding: "40px 30px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    border: "2px solid transparent"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-10px)";
                                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
                                    e.currentTarget.style.borderColor = category.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                                    e.currentTarget.style.borderColor = "transparent";
                                }}
                            >
                                <div style={{ 
                                    fontSize: "48px", 
                                    color: category.color, 
                                    marginBottom: "20px",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <FontAwesomeIcon icon={category.icon} />
                                </div>
                                <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px", color: "#1F2937" }}>
                                    {category.name}
                                </h3>
                                <p style={{ color: "#6B7280", fontSize: "14px" }}>{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works for Your Business</h2>
                        <p className="section-subtitle">Start getting actionable customer insights in three simple steps</p>
                    </div>
                    <div className="steps-wrapper">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Your Customers Share Feedback</h3>
                            <p className="step-description">
                                Customers use voice or text to share their experience naturally. 
                                Our AI guides them through meaningful conversations about your business.
                            </p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3 className="step-title">AI Analyzes & Identifies Issues</h3>
                            <p className="step-description">
                                Our AI analyzes sentiment, extracts key feedback points, and identifies 
                                what customers love and what needs improvement.
                            </p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3 className="step-title">You Get Actionable Insights</h3>
                            <p className="step-description">
                                View your dashboard to see top issues, customer sentiment trends, and 
                                prioritized recommendations on what to improve first.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Simple, Transparent Pricing</h2>
                        <p className="section-subtitle">Choose the plan that fits your business needs</p>
                    </div>
                    <div className="pricing-grid">
                        {pricingPlans.map((plan, index) => (
                            <div 
                                key={index} 
                                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                                style={{ borderColor: plan.color }}
                            >
                                {plan.popular && (
                                    <div className="popular-badge" style={{ background: plan.color }}>
                                        Most Popular
                                    </div>
                                )}
                                <div className="pricing-header">
                                    <div className="pricing-icon-wrapper" style={{ background: `${plan.color}15`, color: plan.color }}>
                                        <FontAwesomeIcon icon={plan.icon} className="pricing-icon" />
                                    </div>
                                    <h3 className="pricing-name">{plan.name}</h3>
                                    <div className="pricing-price">
                                        <span className="price-amount">{plan.price}</span>
                                        {plan.price !== "$0" && <span className="price-period">/month</span>}
                                    </div>
                                    <p className="pricing-users">{plan.users}</p>
                                </div>
                                <div className="pricing-features">
                                    <ul className="features-list">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="feature-item">
                                                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" style={{ color: plan.color }} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button 
                                    className="pricing-button"
                                    style={{ 
                                        background: plan.color,
                                        borderColor: plan.color
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = plan.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = plan.color;
                                        e.currentTarget.style.color = 'white';
                                    }}
                                >
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="about-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">About survAI</h2>
                        <p className="section-subtitle">Empowering businesses with AI-powered customer insights</p>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <p className="about-paragraph">
                                At survAI, we believe that every customer conversation is an opportunity to improve. 
                                Our mission is to help business owners understand their customers better through 
                                natural, voice-powered feedback collection and AI-driven analysis.
                            </p>
                            <p className="about-paragraph">
                                Founded with the vision of making customer feedback accessible and actionable, 
                                survAI transforms how businesses collect, analyze, and act on customer insights. 
                                We combine cutting-edge AI technology with intuitive design to deliver 
                                real-time analytics that drive business growth.
                            </p>
                            <div className="about-stats">
                                <div className="about-stat-item">
                                    <div className="about-stat-value">100+</div>
                                    <div className="about-stat-label">Business Categories</div>
                                </div>
                                <div className="about-stat-item">
                                    <div className="about-stat-value">AI-Powered</div>
                                    <div className="about-stat-label">Insights Engine</div>
                                </div>
                                <div className="about-stat-item">
                                    <div className="about-stat-value">Real-Time</div>
                                    <div className="about-stat-label">Analytics</div>
                                </div>
                            </div>
                        </div>
                        <div className="about-features">
                            <div className="about-feature-card">
                                <FontAwesomeIcon icon={faBrain} className="about-feature-icon" />
                                <h3>AI-Powered Analysis</h3>
                                <p>Advanced machine learning algorithms understand customer sentiment and extract actionable insights</p>
                            </div>
                            <div className="about-feature-card">
                                <FontAwesomeIcon icon={faChartBar} className="about-feature-icon" />
                                <h3>Real-Time Dashboard</h3>
                                <p>Get instant visibility into customer feedback trends and improvement opportunities</p>
                            </div>
                            <div className="about-feature-card">
                                <FontAwesomeIcon icon={faShield} className="about-feature-icon" />
                                <h3>Secure & Private</h3>
                                <p>Enterprise-grade security ensures your customer data is always protected</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer-section">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-column">
                            <div className="footer-logo">
                                <FontAwesomeIcon icon={faMicrophone} className="footer-logo-icon" />
                                <span className="footer-logo-text">survAI</span>
                            </div>
                            <p className="footer-description">
                                AI-powered customer feedback platform helping businesses 
                                understand their customers and grow through actionable insights.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <span>f</span>
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <span>𝕏</span>
                                </a>
                                <a href="#" className="social-link" aria-label="LinkedIn">
                                    <span>in</span>
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <span>IG</span>
                                </a>
                            </div>
                        </div>
                        <div className="footer-column">
                            <h3 className="footer-heading">Product</h3>
                            <ul className="footer-links">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#pricing">Pricing</a></li>
                                <li><a href="/dashboard">Dashboard</a></li>
                                <li><a href="/feedback">Get Feedback</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3 className="footer-heading">Company</h3>
                            <ul className="footer-links">
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3 className="footer-heading">Support</h3>
                            <ul className="footer-links">
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Documentation</a></li>
                                <li><a href="#">API Docs</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3 className="footer-heading">Contact</h3>
                            <ul className="footer-contact">
                                <li>
                                    <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                                    <span>support@survai.com</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                                    <span>123 Business St, City, State 12345</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copyright">
                            © {new Date().getFullYear()} survAI. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}