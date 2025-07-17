import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
import { Link } from "wouter";
import { CompanyCardProps } from "@/lib/types";

export default function CompanyCard({ company }: CompanyCardProps) {
  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(ratingNum)
            ? "fill-current text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-6 text-center">
        <img
          src={company.logo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop"}
          alt={`${company.name} logo`}
          className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
        />
        <h3 className="font-semibold text-gray-900 mb-2">{company.name}</h3>
        
        <div className="flex items-center justify-center space-x-1 mb-2">
          <div className="flex">
            {renderStars(company.rating || "0")}
          </div>
          <span className="text-sm text-gray-600">{company.rating || "N/A"}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {company.reviewCount ? `${company.reviewCount.toLocaleString()}+ reviews` : "No reviews yet"}
        </p>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {company.description || "Leading company in the industry"}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {company.employeeCount || "N/A"} employees
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {company.industry || "Technology"}
          </Badge>
        </div>

        <Link href={`/companies/${company.id}`}>
          <a className="text-blue-600 text-sm font-medium hover:underline">
            View jobs
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}
