import React from 'react';
import config from '@/utils/config';
import {fetchEditorialPage, fetchCollectionNavigation, fetchWritingNavigation, fetchAllCaseStudies} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';
import ProjectsTabs from './ProjectsTabs';

const ProjectPage = async () => {
  const [projectLinks, writingLinks, caseStudies] = await Promise.all([
    fetchCollectionNavigation(),
    fetchWritingNavigation(),
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
  }));

  const caseStudyPosts: Post[] = (caseStudies || []).map((cs) => ({
    url: `/${cs.slug}`,
    title: cs.title,
    slug: `/${cs.slug}`,
    image: cs.coverImage?.url || '',
    date: undefined,
    isPublic: cs.isPublic,
    category: cs.tags?.join(', ') || '',
    published: cs.sys?.firstPublishedAt || 'Not specified',
  }));

  const seen = new Set(navProjects.map(p => p.url));
  const projects = [
    ...navProjects,
    ...caseStudyPosts.filter(p => !seen.has(p.url)),
  ].sort((a, b) => (b.published > a.published ? 1 : -1));

  const writings: Post[] = writingLinks.map((link) => ({
    url: link.url,
    title: link.title,
    slug: link.url,
    image: link.image,
    description: link.description,
    date: link.date,
    isPublic: link.isPublic,
    isMembersOnly: link.isMembersOnly,
    category: link.category,
    published: link.published || 'Not specified',
  }));

    return <ProjectsTabs projects={projects} writings={writings} />;
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('projects') || {};
    return {
        ...config.seo,
        ...getEditorialSeo(page),
        title: 'Projects & Writing | Christopher State',
        description: 'Creative projects and written content exploring design, technology, and innovation'
    };
};

export const revalidate = 86400; // 24 hours

export default ProjectPage;
