import React from "react";
import { Shield, Clock, Database, Lock, Award, Users } from "lucide-react";

export default function WhyChooseSection() {
    const features = [
        {
            icon: Shield,
            title: "100% Free",
            description: "No hidden fees, no subscriptions. Get comprehensive VIN reports at absolutely no cost.",
            color: "bg-green-400"
        },
        {
            icon: Clock,
            title: "Instant Results",
            description: "Get your complete vehicle report within seconds. No waiting, no delays.",
            color: "bg-blue-400"
        },
        {
            icon: Database,
            title: "Comprehensive Data",
            description: "Access detailed information including specs, history, recalls, and market value.",
            color: "bg-purple-400"
        },
        {
            icon: Lock,
            title: "Secure & Private",
            description: "Your searches are completely private and secure. We don't store your personal data.",
            color: "bg-red-400"
        },
        {
            icon: Award,
            title: "Accurate Information",
            description: "Regularly updated to keep results relevant and dependable.",
            color: "bg-yellow-400"
        },
        {
            icon: Users,
            title: "Trusted by Professionals",
            description: "Built with reliability and clarity for confident vehicle research.",
            color: "bg-orange-400"
        }
    ];

    return (
        <div className="bg-gray-50 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black" data-testid="text-why-choose-title">
                        Why Choose Our
                        <span className="block text-blue-600 transform rotate-[-1deg] -mt-2">
                            VIN Decoder?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-700 font-bold max-w-3xl mx-auto" data-testid="text-why-choose-description">
                        Our free VIN decoder provides instant, comprehensive vehicle reports with 
                        accuracy you can count on.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={feature.title}
                            className={`bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] transform ${
                                index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                            } hover:shadow-[8px_8px_0px_0px_#000] hover:transform hover:rotate-0 transition-all duration-150`}
                            data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <div className={`transform ${index % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-1deg]'}`}>
                                <div className={`w-16 h-16 ${feature.color} border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] mb-6`}>
                                    <feature.icon className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-black uppercase mb-4">{feature.title}</h3>
                                <p className="text-gray-700 font-bold leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}