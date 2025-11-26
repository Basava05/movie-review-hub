import { useState } from "react";
import { ReviewForm } from "@/components/ReviewForm";
import { LatestReview } from "@/components/LatestReview";
import { Film } from "lucide-react";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-10 h-10 text-primary animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Movie Reviews
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Share your thoughts on movies you've watched and see what others think
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          <LatestReview refreshTrigger={refreshTrigger} />
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground text-sm">
          <p>Built for movie enthusiasts</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
