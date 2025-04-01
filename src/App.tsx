import "./App.css";
import AppHeader from "./components/AppHeader";
import AvatarCard from "./components/AvatarCard";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-4xl w-full px-4 py-6">
        <AppHeader />
        <AvatarCard />
      </div>
    </div>
  );
}

export default App;
