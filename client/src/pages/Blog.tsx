import React from "react";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Car, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Blog cover images as public assets
const kiaEV9Image = "/assets/339926669_932340544781174_9134420496578326768_n_1755727621094.jpg";
const vehicleHistoryImage = "/assets/Vehicle Hisotory Report_1755727621095.jpg";
const exportCarsImage = "/assets/Export Cars Dubai_1755727621095.webp";
const exportShipImage = "/assets/Export Cars From Dubai_1755727621095.jpg";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "american-european-car-history-guide",
    title: "Complete Guide to American & European Car History Checks by VIN and Chassis Number",
    excerpt: "Comprehensive guide covering car history checks for American and European vehicles across the Middle East, Europe, and USA. Learn about VIN checks, chassis number verification, and regional platforms like RTA, MOI, and Emirates Vehicle Gate.",
    content: `Buying a used car can be risky—especially when it's imported from another country. Whether you're purchasing in the Middle East, Europe, or the USA, running a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check by chassis number</a> or a VIN check is essential to avoid scams and costly repairs.

With advanced tools, you can now perform everything from a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">USA car history check</a> to a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check free Europe</a> in just minutes.

<div className="my-8">
  <img src="/api/placeholder/800/400" alt="Car History Check Interface" className="w-full max-w-4xl mx-auto rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_#000]" />
  <p className="text-center text-sm font-bold mt-4 text-gray-600">Professional Car History Check Interface</p>
</div>

## 🔍 Car History Check by Chassis Number

Every car has a unique chassis number. Running a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check by chassis number free</a> provides details like:

- Accident records
- Odometer history  
- Ownership verification
- Recall notices

You can even perform an <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">American car chassis number check free</a> if you're dealing with imports from the United States.

## 🌍 VIN Checks in the Middle East

Countries in the Middle East provide official platforms for verification. Examples include:

- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">RTA VIN check</a> – for vehicles registered in Dubai and the UAE.
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">Emirates Vehicle Gate VIN check</a> – allows UAE residents to track accidents and repairs.
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">MOI VIN check</a> – Ministry of Interior platforms across the Gulf provide vehicle status reports.
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">MOI accident history check</a> – reveals whether a car has been in reported crashes.

If you're purchasing American imports, you can even access an <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">American car history check in Middle East free</a> or through the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">American car history check in Middle East app and check car accident history USA free</a>.

<div className="my-8">
  <img src="/api/placeholder/600/350" alt="Middle East VIN Check Platforms" className="w-full max-w-3xl mx-auto rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_#000]" />
  <p className="text-center text-sm font-bold mt-4 text-gray-600">Regional VIN Check Platforms in the Middle East</p>
</div>

## 🇺🇸 American Car History Checks

Many cars imported to the Middle East and Africa come from the United States. To protect yourself, you can run a:

- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">vin check American cars</a>
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check American cars free</a>
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check American cars online</a>
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check American cars by VIN number</a>
- <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check American cars by VIN</a>

If you're wondering <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">how to check American car accident history</a>, the best option is to use reliable VIN and chassis number lookup services that pull from US insurance and DMV databases.

## 🌍 European Car History Checks

If you're purchasing an imported European vehicle, it's just as important to confirm its background. Services like the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">vin check free Europe</a> and <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check free Europe</a> help reveal details about mileage, theft, and accidents.

Some platforms even offer a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">free VIN check with pictures</a> so you can see the car's past condition before buying.

## 🏆 Best Free VIN Check Options

With so many services available, choosing the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">best free VIN check</a> is key. Look for tools that:

- Work across multiple countries (USA, Europe, Middle East)
- Provide accident history reports
- Include mileage and ownership records
- Offer both VIN and chassis number lookups

By using a trusted platform, you'll get accurate information whether you need a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">USA car history check</a> or a <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check by chassis number</a>.

## ✅ Conclusion: Protect Yourself Before Buying

Whether you're in Europe, the USA, or the Middle East, never buy a car without running a VIN or chassis number check. From the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">RTA VIN check</a> in Dubai to the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">MOI accident history check</a> in the Gulf, and from the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">vin check American cars</a> to the <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check free Europe</a>—these tools ensure you're investing in a safe, legal, and reliable vehicle.

**👉 Start your <a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">car history check by chassis number</a> today at Car's History Check and drive with confidence.**`,
    date: "2025-08-26",
    author: "Cars Club Team",
    category: "Car History",
    readTime: "8 min read",
    image: "/api/placeholder/600/400"
  },
  {
    id: "complete-guide-chassis-number-check",
    title: "Complete Guide to Chassis Number Check, Free VIN & Car History Check",
    excerpt: "When buying or selling a car in Dubai or anywhere in the UAE, it's important to know the car's history to ensure you're getting a fair deal. This comprehensive guide covers chassis number checks, free VIN checks, and vehicle history reports.",
    content: `When buying or selling a car in Dubai or anywhere in the UAE, it's important to know the car's history to ensure you're getting a fair deal. Understanding a vehicle's past – whether it's been in an accident, had major repairs or been through auctions – can make all the difference.

This is where services such as chassis number check, free VIN check, vehicle history check and auction history check come in handy. This guide will show you everything you need to know about these essential car buying tools.

<div className="my-8">
  <img src="/vin-decoder-interface.png" alt="CarsClub.ae Free VIN Decoder Interface" className="w-full max-w-4xl mx-auto rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_#000]" />
  <p className="text-center text-sm font-bold mt-4 text-gray-600">CarsClub.ae Free VIN Decoder & Lookup Service Interface</p>
</div>

**What is a chassis number?**

The chassis number is a unique identifier assigned to every vehicle manufactured. Also known as the Vehicle Identification Number (VIN), it is a 17-digit code containing both numbers and letters that is unique to each vehicle. The VIN provides essential information about the vehicle, such as the manufacturer, model year, production plant and specific vehicle features.

In the UAE, the VIN plays a crucial role in identifying vehicles, especially if you're buying a used car. By performing a VIN check, you can access a car's historical data and ensure that the vehicle is legitimate and free of any legal or mechanical problems.

**Why is a VIN check important?**

Whether you're buying or selling a car in the UAE, a VIN check is essential for a number of reasons:

- **Verify the identity of the car:** Ensure that the car has not been cloned, stolen or tampered with
- **Check for previous accidents or damage:** You can find out if the car has been involved in any major accidents
- **Confirm ownership details:** Verify that the seller is the rightful owner of the vehicle
- **Check auction history:** Some cars may have been purchased at auction and it's important to understand the condition of the vehicle during this process

**What is a VIN check?**

The Vehicle Identification Number (VIN) is the international standard used to identify a vehicle. Similar to the chassis number, the VIN is 17 characters long and contains detailed information about the vehicle. A VIN check provides comprehensive details, allowing you to:

- **Identify any previous accidents**
- **Understand the vehicle's origin and manufacturing details**
- **Obtain a detailed service and maintenance history**
- **Find out about any recalls issued by the manufacturer**

The VIN check also helps to determine if the car has been involved in any major collisions or has any structural damage that could affect its safety and resale value.

**How to run a free VIN check?**

Performing a free VIN check is easy and there are several services available in the UAE that allow you to perform a free VIN check. Here's how to do it:

<div className="my-8">
  <img src="/cars-history-check.png" alt="CarsClub.ae VIN Decoder Service" className="w-full max-w-4xl mx-auto rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_#000]" />
  <p className="text-center text-sm font-bold mt-4 text-gray-600">CarsClub.ae Free VIN Decoder & Lookup Service</p>
</div>

- **Locate the VIN:** The VIN is usually located in the lower left corner of the dashboard, near the windscreen or inside the driver's side door frame. It can also be found on the car's registration documents (Mulkiya)
- **Use free VIN check services:** There are several websites and platforms that allow you to run a free VIN check:
  - **<a href="https://carsclub.ae/" target="_blank" rel="noopener" style="font-weight: bold; text-decoration: underline; color: #2563eb;">carsclub.ae</a>:** Offers free VIN checks and paid-for reports, including details of accidents, mileage and recalls
  - **CarFax:** Provides vehicle history reports that include auction data, accident history and ownership transfers
  - **RTA Dubai Services:** The Roads and Transport Authority of Dubai (RTA) offers online tools to check vehicle information by VIN or chassis number
- **Check the report:** After entering the VIN, you'll receive a detailed report that includes information on the car's history, any accidents and its current status

**Car History Check: Why you need it?**

A Car History Check is a detailed review of the vehicle's past, allowing you to understand its overall condition before making a purchase. Here's why it's important:

- **Accident history:** The most important factor for buyers is whether the car has been involved in any accidents. Some minor accidents may not affect a car's value significantly, but major accidents can lead to long-term mechanical problems or safety concerns
- **Service records:** A consistent maintenance and service history can reassure you that the car has been well maintained and is less likely to have hidden problems
- **Stolen vehicle check:** A vehicle history check can reveal if the car has been reported stolen. In the UAE, it's important to ensure that the car you're buying is free of any legal disputes
- **Flood or fire damage:** Cars that have suffered flood or fire damage are often sold at a much lower price, but may not be safe or reliable. A Car History Check will reveal any such incidents

**How to get a Car History Check in the UAE?**

Several platforms in Dubai and the UAE offer car history checks. Some of the more popular options include:

<div className="my-8">
  <img src="/carsclub-home-page.png" alt="CarsClub.ae Main Platform" className="w-full max-w-4xl mx-auto rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_#000]" />
  <p className="text-center text-sm font-bold mt-4 text-gray-600">CarsClub.ae - UAE's Leading Car Marketplace</p>
</div>

- **RTA Vehicle History Service:** The Dubai Roads and Transport Authority (RTA) offers a vehicle history check service where you can enter the chassis number to get details about the car's background
- **<a href="https://carsclub.ae/" target="_blank" rel="noopener" style="font-weight: bold; text-decoration: underline; color: #2563eb;">carsclub.ae</a>:** offers a vehicle history report with details on whether the car has been involved in any accidents, its service records and other information
- **Emirates Auction:** If the car was sold at auction, Emirates Auction provides auction history and car condition reports

**Auction History Check: What You Should Know?**

Some cars in the UAE are bought and sold through auctions, which can offer great deals but come with risks. An auction history check can help you understand if the car has been sold at auction before and what its condition was at the time. This is important because:

- **Auction cars can have hidden damage:** While cars sold at auction can be a bargain, they may have undisclosed damage or problems. Check the auction history to see if the car was marked as damaged
- **Resale value:** Cars bought at auction may have a lower resale value as they're often sold quickly and may not have undergone a proper inspection

You can check the auction history check through platforms such as Emirates Auction and Copart UAE.

**The importance of knowing a car's auction history**

Buying a car with a clean auction history gives you peace of mind that it hasn't been sold under duress or at a significantly reduced price due to damage. Here's how an auction history check helps:

- **Transparency:** An Auction History Check provides transparency into the condition of the car at the time of sale, helping you avoid surprises later on
- **Valuation insight:** Auction history can indicate if the car has been traded frequently or has remained unsold for a long time, which could be a red flag

**Conclusion**

A chassis number check, free VIN check, vehicle history check and auction history check are essential steps when buying or selling a car in Dubai and the UAE. These checks provide transparency, help prevent fraud and ensure that you make an informed decision.

By using the tools and services available, you can buy a used car with confidence, knowing its full history and avoiding any unpleasant surprises down the road. In a market as dynamic as Dubai, where cars are frequently bought and sold, using these checks can protect you from costly mistakes, whether you're a buyer or a seller.`,
    author: "CarsClub UAE Expert Team",
    date: "2025-01-20",
    category: "UAE Guide",
    readTime: "8 min read",
    image: vehicleHistoryImage
  },
  {
    id: "understanding-vin-numbers",
    title: "Understanding VIN Numbers: Your Complete Guide to Vehicle Identification",
    excerpt: "Learn everything about VIN numbers, how they work, where to find them, and why they're crucial for vehicle history checks.",
    content: `A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle. This alphanumeric code serves as the vehicle's fingerprint, providing essential information about its manufacturing details, specifications, and history.

**Where to Find Your VIN:**
- Dashboard on the driver's side (visible through windshield)
- Driver's side door jamb
- Vehicle registration documents
- Insurance papers
- Engine block or frame

**What Each VIN Position Means:**
- Positions 1-3: World Manufacturer Identifier (WMI)
- Position 4-8: Vehicle Descriptor Section (VDS)
- Position 9: Check digit for verification
- Position 10: Model year
- Position 11: Manufacturing plant
- Positions 12-17: Sequential production number

**Why VIN Checks Matter:**
VIN checks help you verify vehicle authenticity, check for recalls, understand manufacturing details, and access complete vehicle history including accidents, repairs, and ownership changes.`,
    author: "CarsClub Expert Team",
    date: "2025-01-15",
    category: "VIN Guide",
    readTime: "5 min read",
    image: kiaEV9Image
  },
  {
    id: "car-buying-tips-uae",
    title: "Essential Car Buying Tips for UAE Residents: What You Need to Know",
    excerpt: "Navigate the UAE car market with confidence. From inspections to paperwork, here's your complete guide to buying a car in the Emirates.",
    content: `Buying a car in the UAE requires careful consideration of local regulations, market conditions, and vehicle history. Here's your comprehensive guide to making an informed purchase.

**Pre-Purchase Vehicle Inspection:**
Always conduct a thorough inspection before purchasing any vehicle. Check for signs of accident damage, flood damage, or extensive wear. Pay special attention to the engine, transmission, brakes, and electrical systems.

**Documentation Requirements:**
- Emirates ID
- Salary certificate or trade license
- Bank statements (for financing)
- Valid UAE driving license
- Vehicle registration transfer documents

**Understanding the UAE Car Market:**
The UAE has a diverse car market with vehicles from various countries. Many cars are imported from the US, Japan, and Europe. Each origin has different specifications and features.

**Financing Options:**
UAE banks offer competitive car loan rates, typically ranging from 3-7% annually. Compare offers from multiple banks and consider factors like processing fees, early settlement charges, and loan tenure.

**Insurance Considerations:**
Comprehensive insurance is mandatory in the UAE. Factors affecting premiums include vehicle age, driver experience, claim history, and chosen coverage level.`,
    author: "UAE Automotive Specialist",
    date: "2025-01-12",
    category: "Car Buying",
    readTime: "7 min read",
    image: exportCarsImage
  },
  {
    id: "auction-cars-risks-benefits",
    title: "Auction Cars: Understanding the Risks and Benefits Before You Buy",
    excerpt: "Considering an auction vehicle? Learn about the advantages, potential pitfalls, and how to make informed decisions when buying auction cars.",
    content: `Auction vehicles can offer excellent value, but they come with unique considerations that every buyer should understand before making a purchase.

**Types of Auction Vehicles:**
- Insurance total loss vehicles
- Fleet vehicles and lease returns
- Repossessed vehicles
- Dealer trade-ins
- Manufacturer buybacks

**Benefits of Auction Cars:**
- Lower purchase prices
- Wide selection of vehicles
- Potential for finding rare or specialty vehicles
- Transparent bidding process
- Detailed condition reports

**Potential Risks:**
- Hidden damage or mechanical issues
- Limited or no warranty coverage
- Competition from dealers and resellers
- Transportation and logistics costs
- Potential for flood or accident damage

**Essential Research Steps:**
Before bidding on any auction vehicle, obtain a comprehensive vehicle history report. Check for previous accidents, flood damage, multiple owners, or mechanical issues. Understanding the vehicle's background helps you make informed bidding decisions.

**Inspection Tips:**
If possible, inspect the vehicle in person or hire a qualified mechanic. Look for signs of frame damage, flood damage, or extensive wear. Check all electrical systems, engine operation, and body condition.

**Bidding Strategy:**
Set a maximum bid limit and stick to it. Factor in additional costs like transportation, repairs, registration, and insurance when determining your budget.`,
    author: "Auction Vehicle Expert",
    date: "2025-01-10",
    category: "Vehicle History",
    readTime: "6 min read",
    image: exportShipImage
  },
  {
    id: "vehicle-history-importance",
    title: "Why Vehicle History Reports Are Essential for Every Car Purchase",
    excerpt: "Discover why checking a vehicle's history before purchase can save you thousands and help you avoid problematic vehicles.",
    content: `A comprehensive vehicle history report is one of the most important tools in your car-buying arsenal. Here's why every smart buyer should obtain one before making a purchase.

**What Vehicle History Reports Reveal:**
- Accident and damage history
- Flood or fire damage records
- Previous ownership details
- Service and maintenance records
- Recall information
- Lemon law buyback status
- Odometer discrepancies

**Financial Protection:**
Vehicle history reports can save you thousands by revealing hidden problems. A car with accident damage may have reduced value and potential safety issues. Flood-damaged vehicles often develop costly electrical and mechanical problems.

**Safety Considerations:**
Vehicles with significant accident history may have compromised safety systems. Frame damage can affect vehicle stability and crashworthiness. Flood damage can cause electrical failures that impact critical safety systems.

**Market Value Assessment:**
Understanding a vehicle's history helps you negotiate fair pricing. Cars with clean histories command higher prices, while those with issues should be priced accordingly.

**Red Flags to Watch For:**
- Multiple previous owners in a short time
- Gaps in service records
- Evidence of major repairs
- Inconsistent mileage records
- Auction or fleet vehicle history

**Making Informed Decisions:**
Armed with complete vehicle history information, you can make confident purchase decisions. Whether you're buying from a dealer, private party, or auction, knowledge of the vehicle's past is essential for protecting your investment.`,
    author: "Vehicle History Analyst",
    date: "2025-01-08",
    category: "Vehicle History",
    readTime: "5 min read",
    image: vehicleHistoryImage
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `repeating-linear-gradient(
                   45deg,
                   transparent,
                   transparent 50px,
                   rgba(255,255,255,0.1) 50px,
                   rgba(255,255,255,0.1) 52px
                 )`
               }}>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight" data-testid="text-blog-hero-title">
              Automotive Blog
              <span className="block text-yellow-400 transform rotate-[-1deg] -mt-2">
                Expert Insights & Tips
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 font-bold max-w-3xl mx-auto" data-testid="text-blog-hero-description">
              Stay informed with the latest automotive insights, car buying tips, and vehicle history expertise from our team of professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150">
                <div className="aspect-video bg-gray-200 border-b-4 border-black relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 border-2 border-black font-black text-sm uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black uppercase mb-4 text-black line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-700 font-bold mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link href={`/blog/${post.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black">
              Blog Categories
            </h2>
            <p className="text-xl text-gray-700 font-bold">
              Explore articles by topic to find exactly what you're looking for
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: "VIN Guide",
                description: "Complete guides to understanding and using VIN numbers effectively",
                color: "bg-blue-400",
                count: "9 Articles"
              },
              {
                icon: Car,
                title: "Car Buying",
                description: "Expert tips and advice for purchasing vehicles in the UAE",
                color: "bg-green-400",
                count: "12 Articles"
              },
              {
                icon: Shield,
                title: "Vehicle History",
                description: "Understanding vehicle history reports and what they reveal",
                color: "bg-yellow-400",
                count: "6 Articles"
              },
              {
                icon: Car,
                title: "UAE Guide",
                description: "Specific guides for car buying and selling in the UAE market",
                color: "bg-red-400",
                count: "1 Article"
              }
            ].map((category, index) => (
              <div key={index} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 text-center">
                <div className={`w-16 h-16 ${category.color} border-4 border-black flex items-center justify-center mb-4 mx-auto shadow-[4px_4px_0px_0px_#000]`}>
                  <category.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-black uppercase mb-3">{category.title}</h3>
                <p className="text-gray-700 font-bold mb-4">{category.description}</p>
                <span className="bg-gray-200 text-black px-3 py-1 border-2 border-black font-black text-sm uppercase">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
            Need a VIN Check?
            <span className="block text-yellow-400 transform rotate-[-1deg] -mt-2">
              Get Started Now
            </span>
          </h2>
          <p className="text-xl font-bold mb-8">
            Use our free VIN decoder or get comprehensive vehicle history reports
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase">
                Free VIN Decoder
              </Button>
            </Link>
            <Link href="/car-history-check">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase">
                Get Full Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}