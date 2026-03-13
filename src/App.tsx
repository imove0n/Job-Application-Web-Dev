import Logo from './components/Logo';
import BookingForm from './components/BookingForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-xl mx-auto px-4 pb-12">
        <Logo />

        <h1 className="font-heading text-2xl md:text-3xl text-navy/80 font-normal mt-4 mb-8">
          Let's get you on your way!
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-border/50 p-6 md:p-8">
          <BookingForm />
        </div>

        <p className="text-center text-xs text-gray-text mt-6">
          Powered by ExampleIQ
        </p>
      </div>
    </div>
  );
}

export default App;
