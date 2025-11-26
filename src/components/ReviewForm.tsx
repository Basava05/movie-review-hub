import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface ReviewFormProps {
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({ onReviewSubmitted }: ReviewFormProps) => {
  const [movieTitle, setMovieTitle] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState<string>("");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieTitle.trim() || !reviewerName.trim() || !rating || !reviewText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert([
        {
          movie_title: movieTitle.trim(),
          reviewer_name: reviewerName.trim(),
          rating: parseInt(rating),
          review_text: reviewText.trim(),
        },
      ]);

      if (error) throw error;

      toast.success("Review submitted successfully!");
      
      // Reset form
      setMovieTitle("");
      setReviewerName("");
      setRating("");
      setReviewText("");
      
      // Notify parent to refresh latest review
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-primary text-primary" />
          <CardTitle className="text-2xl">Submit Your Review</CardTitle>
        </div>
        <CardDescription>Share your thoughts about a movie you've watched</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="movieTitle">Movie Title</Label>
            <Input
              id="movieTitle"
              placeholder="Enter movie title"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              required
              className="bg-input/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewerName">Your Name</Label>
            <Input
              id="reviewerName"
              placeholder="Enter your name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
              className="bg-input/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={rating} onValueChange={setRating} required>
              <SelectTrigger id="rating" className="bg-input/50">
                <SelectValue placeholder="Select rating (1-5)" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: num }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                      <span className="ml-2">({num}/5)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewText">Your Review</Label>
            <Textarea
              id="reviewText"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              className="min-h-[120px] bg-input/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-gold hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
