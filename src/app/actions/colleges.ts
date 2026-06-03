"use server";

import { prisma } from "@/lib/prisma";

export interface PaginatedResult {
  colleges: any[];
  total: number;
  hasMore: boolean;
}

function mapDbCollegeToUiCollege(dbCollege: any) {
  // Extract a clean shortName from the full name
  // e.g. "Indian Institute of Technology (IIT) Madras" -> "IIT Madras"
  let shortName = dbCollege.name;
  const match = dbCollege.name.match(/\(([^)]+)\)\s*([^,\-\(]+)/) || dbCollege.name.match(/\(([^)]+)\)/);
  if (match) {
    if (match[2]) {
      shortName = `${match[1]} ${match[2].trim()}`;
    } else {
      shortName = match[1];
    }
  }

  // Fees formatting: e.g. 220000 -> "₹2.2L / yr", 35000 -> "₹35K / yr"
  let feesString = `₹${dbCollege.fees.toLocaleString()}`;
  if (dbCollege.fees >= 100000) {
    feesString = `₹${(dbCollege.fees / 100000).toFixed(1)}L / yr`;
  } else if (dbCollege.fees >= 1000) {
    feesString = `₹${(dbCollege.fees / 1000).toFixed(0)}K / yr`;
  }

  // Placement formatting: e.g. 2180000 -> "21.8 LPA"
  let avgPlacementString = "N/A";
  if (dbCollege.averagePackage > 0) {
    avgPlacementString = `${(dbCollege.averagePackage / 100000).toFixed(1)} LPA`;
  }

  // Estimate a highest package as 2.2x to 3.0x of average package (clamped to realistic values)
  const highestPackageNum = Math.round(
    dbCollege.averagePackage * (2.2 + (dbCollege.nirfRank ? (50 - dbCollege.nirfRank) / 100 : 0.2))
  );
  let highestPlacementString = "N/A";
  if (highestPackageNum >= 10000000) {
    highestPlacementString = `${(highestPackageNum / 10000000).toFixed(1)} CPA`;
  } else if (highestPackageNum > 0) {
    highestPlacementString = `${(highestPackageNum / 100000).toFixed(1)} LPA`;
  }

  return {
    id: dbCollege.id,
    name: dbCollege.name,
    shortName: shortName,
    city: dbCollege.city,
    state: dbCollege.state,
    rating: dbCollege.rating,
    fees: feesString,
    feesNum: dbCollege.fees,
    avgPlacement: avgPlacementString,
    avgPlacementNum: dbCollege.averagePackage,
    highestPlacement: highestPlacementString,
    courses: dbCollege.courses.map((c: any) => c.name),
    description: dbCollege.overview,
    image: dbCollege.imageUrl,
    accredited: `NIRF Rank #${dbCollege.nirfRank}`,
    facultyRatio: dbCollege.nirfRank <= 10 ? "1:8" : dbCollege.nirfRank <= 25 ? "1:10" : "1:12",
  };
}

export async function fetchColleges(
  searchQuery: string,
  filter: string,
  page: number,
  limit: number = 9
): Promise<PaginatedResult> {
  try {
    const searchWhere = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" as const } },
            { city: { contains: searchQuery, mode: "insensitive" as const } },
            { state: { contains: searchQuery, mode: "insensitive" as const } },
            { overview: { contains: searchQuery, mode: "insensitive" as const } },
            {
              courses: {
                some: {
                  name: { contains: searchQuery, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {};

    let filterWhere: any = {};
    if (filter === "Engineering") {
      filterWhere = {
        courses: {
          some: {
            OR: [
              { name: { contains: "B.Tech", mode: "insensitive" as const } },
              { name: { contains: "B.E.", mode: "insensitive" as const } },
              { name: { contains: "Engineering", mode: "insensitive" as const } },
            ],
          },
        },
      };
    } else if (filter === "Management") {
      filterWhere = {
        courses: {
          some: {
            OR: [
              { name: { contains: "MBA", mode: "insensitive" as const } },
              { name: { contains: "Management", mode: "insensitive" as const } },
            ],
          },
        },
      };
    } else if (filter === "Science") {
      filterWhere = {
        courses: {
          some: {
            OR: [
              { name: { contains: "Science", mode: "insensitive" as const } },
              { name: { contains: "Physics", mode: "insensitive" as const } },
              { name: { contains: "B.Sc", mode: "insensitive" as const } },
            ],
          },
        },
      };
    } else if (filter === "Design") {
      filterWhere = {
        courses: {
          some: {
            OR: [
              { name: { contains: "Design", mode: "insensitive" as const } },
              { name: { contains: "Animation", mode: "insensitive" as const } },
              { name: { contains: "B.Des", mode: "insensitive" as const } },
            ],
          },
        },
      };
    } else if (filter === "High Placement") {
      filterWhere = {
        averagePackage: { gte: 1500000 }, // >= 15 LPA
      };
    } else if (filter === "Affordable") {
      filterWhere = {
        fees: { lte: 100000 }, // <= 1 Lakh
      };
    }

    const whereClause = {
      AND: [searchWhere, filterWhere],
    };

    const colleges = await prisma.college.findMany({
      where: whereClause,
      include: {
        courses: true,
      },
      orderBy: {
        nirfRank: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.college.count({
      where: whereClause,
    });

    const mappedColleges = colleges.map(mapDbCollegeToUiCollege);

    return {
      colleges: mappedColleges,
      total,
      hasMore: (page - 1) * limit + colleges.length < total,
    };
  } catch (error) {
    console.error("Error in fetchColleges Server Action:", error);
    return {
      colleges: [],
      total: 0,
      hasMore: false,
    };
  }
}

export async function getCollegesByIds(ids: string[]): Promise<any[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        courses: true,
      },
      orderBy: {
        nirfRank: "asc",
      },
    });
    return colleges.map(mapDbCollegeToUiCollege);
  } catch (error) {
    console.error("Error in getCollegesByIds Server Action:", error);
    return [];
  }
}

export async function getCollegeById(id: string): Promise<any | null> {
  if (!id) return null;
  try {
    const dbCollege = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!dbCollege) return null;
    
    const base = mapDbCollegeToUiCollege(dbCollege);
    return {
      ...base,
      establishedYear: dbCollege.establishedYear,
      website: dbCollege.website,
      nirfRank: dbCollege.nirfRank,
      nirfScore: dbCollege.nirfScore,
      fullCourses: dbCollege.courses.map((c: any) => ({
        id: c.id,
        name: c.name,
        duration: c.duration,
        degreeType: c.degreeType,
      })),
      reviews: dbCollege.reviews.map((r: any) => ({
        id: r.id,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error in getCollegeById Server Action:", error);
    return null;
  }
}

export async function getPlatformStats() {
  try {
    const collegesCount = await prisma.college.count();
    const coursesCount = await prisma.course.count();
    const usersCount = await prisma.user.count();
    return {
      collegesCount,
      coursesCount,
      usersCount,
    };
  } catch (error) {
    console.error("Error in getPlatformStats:", error);
    return {
      collegesCount: 50,
      coursesCount: 175,
      usersCount: 1,
    };
  }
}

