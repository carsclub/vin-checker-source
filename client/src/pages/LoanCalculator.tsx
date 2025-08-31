import { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";
import GoogleAd from "@/components/GoogleAd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function LoanCalculator() {
  const [carPrice, setCarPrice] = useState(42000);
  const [downPayment, setDownPayment] = useState(8400);
  const [interestRate, setInterestRate] = useState(2.79);
  const [loanPeriod, setLoanPeriod] = useState(5);
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const downPaymentPercentage = Math.round((downPayment / carPrice) * 100);

  const calculateLoan = () => {
    const principal = carPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanPeriod * 12;
    
    if (monthlyRate === 0) {
      const payment = principal / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalLoanAmount(principal);
      setTotalInterest(0);
    } else {
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      const totalAmount = payment * numberOfPayments;
      const interest = totalAmount - principal;
      
      setMonthlyPayment(payment);
      setTotalLoanAmount(totalAmount);
      setTotalInterest(interest);
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [carPrice, downPayment, interestRate, loanPeriod]);

  const handleDownPaymentSlider = (value: number[]) => {
    setDownPayment(value[0]);
  };

  const handleInterestRateSlider = (value: number[]) => {
    setInterestRate(value[0]);
  };

  const loanPeriodOptions = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 pt-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-yellow-400 border-8 border-black p-8 shadow-[16px_16px_0px_0px_#000] transform rotate-[-1deg] inline-block">
            <div className="transform rotate-[1deg]">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-black" />
              <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-4">
                Car Finance Calculator
              </h1>
              <p className="text-xl font-bold text-black">Calculate Your Monthly Payments </p>
            </div>
          </div>
        </div>
      </div>
      {/* Calculator Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Monthly Payment Result */}
            <div className="lg:col-span-2 mb-8">
              <div className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_#000] transform rotate-[-0.5deg]">
                <div className="transform rotate-[0.5deg] text-center">
                  <h2 className="text-2xl font-black uppercase text-gray-700 mb-2">
                    Monthly Payment
                  </h2>
                  <div className="text-5xl md:text-6xl font-black text-blue-600 mb-6">
                    AED {Math.round(monthlyPayment).toLocaleString()}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                      <span className="text-lg font-bold text-gray-700">Total Loan Amount</span>
                      <span className="text-xl font-black text-black">
                        AED {Math.round(totalLoanAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                      <span className="text-lg font-bold text-gray-700">Total Interest</span>
                      <span className="text-xl font-black text-red-600">
                        AED {Math.round(totalInterest).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Price Input */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-black uppercase text-black">Car Price</h3>
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-sm font-bold text-gray-700 whitespace-nowrap">AED</Label>
                <Input
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                  className="text-2xl font-black text-center border-4 border-gray-300 focus:border-blue-500"
                  data-testid="input-car-price"
                />
              </div>
              <Slider
                value={[carPrice]}
                onValueChange={(value) => setCarPrice(value[0])}
                min={10000}
                max={500000}
                step={1000}
                className="mt-4"
              />
              <div className="flex justify-between text-sm font-bold text-gray-600 mt-2">
                <span>AED 10K</span>
                <span>AED 500K</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-2xl font-black uppercase text-black">Down Payment</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-bold text-gray-700">Amount (AED)</Label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="text-xl font-black text-center border-4 border-gray-300 focus:border-green-500"
                    data-testid="input-down-payment"
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-gray-700">Percentage</Label>
                  <div className="text-xl font-black text-center py-2 px-3 bg-green-100 border-4 border-green-300">
                    {downPaymentPercentage}%
                  </div>
                </div>
              </div>
              <Slider
                value={[downPayment]}
                onValueChange={handleDownPaymentSlider}
                min={0}
                max={carPrice * 0.5}
                step={500}
                className="mt-2"
              />
              <div className="flex justify-between text-sm font-bold text-gray-600 mt-2">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex items-center gap-3 mb-4">
                <Percent className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-black uppercase text-black">Interest Rate</h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step="0.01"
                  className="text-2xl font-black text-center border-4 border-gray-300 focus:border-red-500"
                  data-testid="input-interest-rate"
                />
                <span className="text-2xl font-black text-black">%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={handleInterestRateSlider}
                min={0.5}
                max={15}
                step={0.1}
                className="mt-2"
              />
              <div className="flex justify-between text-sm font-bold text-gray-600 mt-2">
                <span>0.5%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Loan Period */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-black uppercase text-black">Loan Period</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {loanPeriodOptions.map((period) => (
                  <button
                    key={period}
                    onClick={() => setLoanPeriod(period)}
                    className={`py-3 px-4 text-lg font-black border-4 border-black transition-all duration-150 ${
                      loanPeriod === period
                        ? 'bg-purple-600 text-white shadow-[4px_4px_0px_0px_#000]'
                        : 'bg-white text-black hover:bg-purple-100 shadow-[2px_2px_0px_0px_#000]'
                    }`}
                    data-testid={`button-loan-period-${period}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-bold text-gray-600 mt-3">
                Years
              </p>
            </div>
          </div>

          {/* UAE Banking Info */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 border-8 border-black p-8 shadow-[12px_12px_0px_0px_#000] transform rotate-[0.5deg]">
              <div className="transform rotate-[-0.5deg] text-center">
                <h3 className="text-3xl font-black uppercase text-white mb-4">
                  🏦 UAE Car Finance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div className="bg-black bg-opacity-20 p-4 border-4 border-white">
                    <h4 className="text-xl font-black uppercase mb-2">Typical Rates</h4>
                    <p className="text-lg font-bold">2.49% - 4.99% APR</p>
                  </div>
                  <div className="bg-black bg-opacity-20 p-4 border-4 border-white">
                    <h4 className="text-xl font-black uppercase mb-2">Max Finance</h4>
                    <p className="text-lg font-bold">Up to 80% of car value</p>
                  </div>
                  <div className="bg-black bg-opacity-20 p-4 border-4 border-white">
                    <h4 className="text-xl font-black uppercase mb-2">Loan Term</h4>
                    <p className="text-lg font-bold">1 - 7 years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-yellow-400 text-black p-6 border-4 border-white shadow-[6px_6px_0px_0px_#fff] transform rotate-[-1deg] inline-block">
            <div className="transform rotate-[1deg]">
              <p className="font-black uppercase text-lg">
                FREE CAR LOAN CALCULATOR • DUBAI UAE • INSTANT RESULTS
              </p>
            </div>
          </div>
          <div className="mt-8">
            <p className="font-bold text-gray-300">
              2025 all rights reserved by carsclub.ae • Email:{" "}
              <a
                href="mailto:info@carshistorycheck.com"
                className="underline text-white hover:text-yellow-400 border-4 border-white px-2 py-0.5 inline-block shadow-[4px_4px_0px_0px_#fff]"
              >
                info@carshistorycheck.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}