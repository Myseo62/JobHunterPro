import { useQuery } from "@tanstack/react-query";
import CompanyCard from "./company-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function FeaturedCompanies() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/companies/featured"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Top companies hiring now</h2>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-lg" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto mb-2" />
              <Skeleton className="h-3 w-20 mx-auto mb-4" />
              <Skeleton className="h-3 w-32 mx-auto mb-4" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Top companies hiring now</h2>
        <Link href="/companies">
          <a className="text-blue-600 font-medium hover:underline">View all companies</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {companies?.map((company: any) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
