import { getCollegeById } from "@/app/actions/colleges";
import { notFound } from "next/navigation";
import CollegeDetailClient from "./CollegeDetailClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for SEO best practices
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await getCollegeById(id);
  if (!college) {
    return {
      title: "College Not Found - CampusCompass",
      description: "The requested college profile could not be found.",
    };
  }
  return {
    title: `${college.name} - Placement, Fees, Courses & Reviews | CampusCompass`,
    description: `Explore ${college.name} overview, tuition fees, average packages, courses, recruiter lists, and student reviews.`,
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const college = await getCollegeById(id);

  if (!college) {
    notFound();
  }

  return <CollegeDetailClient college={college} />;
}
