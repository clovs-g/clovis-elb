import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { teamMembers } from '../data/team';
import { Leaf, Award, Heart, Users, Clock, MapPin } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-rose-500" />,
      title: 'Made with Love',
      description: 'Every item is crafted with passion and care, using traditional techniques passed down through generations.'
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      title: 'Fresh Ingredients',
      description: 'We source locally when possible and use only the finest, freshest ingredients in all our baked goods.'
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: 'Award Winning',
      description: 'Recognized for excellence in baking with multiple local and regional awards for our outstanding quality.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Community Focused',
      description: 'Proud to be part of the local community, supporting local events and charitable causes.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Our Story"
        subtitle="Passionately baking since 2020"
        ctaText="Meet Our Team"
        ctaAction={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Our Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/3992204/pexels-photo-3992204.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                alt="Bakery team at work"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Philosophy</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Founded in 2020 by Melissa El-Baker, Elbaker our Bakery began as a dream to create 
                a place where traditional baking meets modern innovation. What started as a small 
                neighborhood bakery has grown into a beloved destination for exceptional baked goods.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our commitment goes beyond just creating delicious treats. We believe in building 
                relationships, supporting our community, and preserving the artisan traditions that 
                make each bite special. Every morning, we arrive early to begin the process of 
                transforming simple ingredients into extraordinary experiences.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From our signature sourdough that takes three days to perfect, to custom wedding 
                cakes that celebrate life's most precious moments, we approach each creation with 
                the same dedication to excellence and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-lg text-gray-600">The values and principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section id="team" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The talented individuals behind every delicious creation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-amber-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>c
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Quality Commitment</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We source the finest ingredients and employ time-tested techniques to ensure 
              every product meets our exacting standards of quality and taste.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organic & Local</h3>
              <p className="text-gray-600">Sourced from trusted local farms and suppliers whenever possible</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh Daily</h3>
              <p className="text-gray-600">Baked fresh every morning using traditional methods</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Handcrafted</h3>
              <p className="text-gray-600">Made by skilled artisan bakers with attention to detail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Involvement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Community Involvement</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We believe in giving back to the community that has supported us throughout our journey. 
                Elbaker proudly partners with local schools, charities, and community events to spread 
                joy and support important causes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-gray-600">Monthly donations to local food banks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-gray-600">Sponsor of annual community festival</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-gray-600">Free baking classes for local schools</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-gray-600">Support for local sports teams and events</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                alt="Community involvement"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;