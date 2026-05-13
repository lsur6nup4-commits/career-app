import jobsJson from "@/seed/jobs.json";
import majorsJson from "@/seed/majors.json";
import type { Job } from "@/types/job";
import type { Major } from "@/types/major";

const jobs = jobsJson as Job[];
const majors = majorsJson as Major[];

export function getAllJobs(): Job[] {
  return jobs;
}

export function getJobById(id: string | number): Job | null {
  const cd = Number(id);
  return jobs.find((j) => j.job_cd === cd) ?? null;
}

export function getJobCategories(): string[] {
  return Array.from(new Set(jobs.map((j) => j.top_nm))).sort();
}

export function searchJobs(opts?: {
  query?: string;
  category?: string;
}): Job[] {
  const q = opts?.query?.trim().toLowerCase();
  return jobs.filter((j) => {
    if (q) {
      const inName = j.job_nm.toLowerCase().includes(q);
      const inRel = j.rel_job_nm.toLowerCase().includes(q);
      const inAptit = j.aptit_name.toLowerCase().includes(q);
      if (!inName && !inRel && !inAptit) return false;
    }
    if (opts?.category && opts.category !== "전체" && j.top_nm !== opts.category)
      return false;
    return true;
  });
}

/** 직업에 연결된 학과 객체 목록 */
export function getRelatedMajors(job: Job): Major[] {
  return job.relatedMajors
    .map((id) => majors.find((m) => m.id === id))
    .filter((m): m is Major => m !== undefined);
}

/** 학과에 연결된 직업 목록 (careerPaths 기반) */
export function getJobsForMajor(majorId: string): Job[] {
  return jobs.filter((j) => j.relatedMajors.includes(majorId));
}
