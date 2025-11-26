import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Star, Calendar, User, Film } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  movie_title: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface LatestReviewProps {
  refreshTrigger: number;
}

export const LatestReview = ({ refreshTrigger }: LatestReviewProps) => {
  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestReview();
  }, [refreshTrigger]);

  const fetchLatestReview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setLatestReview(data);
    } catch (err) {
      console.error("Error fetching latest review:", err);
      setError("Unable to load latest review");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-pulse">
        <CardHeader>
          <CardTitle className="text-2xl">Latest Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm border-destructive/50">
        <CardHeader>
          <CardTitle className="text-2xl">Latest Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!latestReview) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Latest Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Film className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No reviews yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Be the first to share your movie review!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-spotlight backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Latest Review</CardTitle>
        <CardDescription>Most recent movie review submitted</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Film className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Movie</p>
              <h3 className="text-xl font-semibold text-foreground">{latestReview.movie_title}</h3>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Reviewer</p>
              <p className="text-foreground font-medium">{latestReview.reviewer_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: latestReview.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
                {Array.from({ length: 5 - latestReview.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-muted-foreground" />
                ))}
                <span className="ml-2 text-foreground font-medium">({latestReview.rating}/5)</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="text-foreground">{format(new Date(latestReview.created_at), "PPpp")}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Review</p>
          <p className="text-foreground leading-relaxed">{latestReview.review_text}</p>
        </div>
      </CardContent>
    </Card>
  );
};
