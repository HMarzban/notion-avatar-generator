import "./App.css";
import AppHeader from "./components/AppHeader";
import AvatarCard from "./components/AvatarCard";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full px-2 sm:px-4 py-4 sm:py-6">
        <AppHeader />
        <AvatarCard />
      </div>
    </div>
  );
}

export default App;
