import React from 'react';
import config from '@/utils/config';
import {fetchEditorialPage, fetchCollectionNavigation, fetchAllCaseStudies} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';
import ProjectsTabs from './ProjectsTabs';

const ProjectPage = async () => {
  const [projectLinks, caseStudies] = await Promise.all([
    fetchCollectionNavigation(),
    fetchAllCaseStudies(),
  ]);

  const navProjects: Post[] = projectLinks.map((link) => ({
    url: link.url,
    title: link.title,
    slug: link.url,
    image: link.image,
    description: link.description,
    date: link.date,
    isPublic: link.isPublic,
    category: link.category,
    published: link.published || 'Not specified',
    kind: 'project' as const,
  }));

  const caseStudyPosts: Post[] = (caseStudies || []).map((cs) => ({
    url: `/projects/${cs.slug}`,
    title: cs.title,
    slug: `/projects/${cs.slug}`,
    image: cs.coverImage?.url || '',
    date: undefined,
    isPublic: cs.isPublic,
    category: cs.tags?.join(', ') || '',
    published: cs.sys?.firstPublishedAt || 'Not specified',
    kind: 'case-study' as const,
  }));

  const seen = new Set(navProjects.map(p => p.url));
  const projects = [
    ...navProjects,
    ...caseStudyPosts.filter(p => !seen.has(p.url)),
  ].sort((a, b) => (b.published > a.published ? 1 : -1));

    return <ProjectsTabs projects={projects} />;
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('projects') || {};
    return {
        ...config.seo,
        ...getEditorialSeo(page),
        title: 'Projects | Christopher State',
        description: 'Selected design and engineering work'
    };
};

export const revalidate = 86400; // 24 hours

export default ProjectPage;
