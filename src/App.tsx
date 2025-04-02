import "./App.css";
import AppHeader from "./components/AppHeader";
import AvatarCard from "./components/AvatarCard";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <AppHeader />
        <AvatarCard />
      </div>
    </div>
  );
}

export default App;
