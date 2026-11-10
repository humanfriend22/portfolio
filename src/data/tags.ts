// Icon category for each project `stack` entry. Names are lowercase and matched case-insensitively; unlisted names fall back to "software".
export const tagCategories: Record<string, string[]> = {
  language: [
    'javascript', 'typescript', 'python', 'c', 'c++', 'c#', 'java', 'go', 'rust', 'swift', 'kotlin', 'lua', 'bash',
    'html', 'css', 'sql', 'markdown', 'mdx', 'yaml', 'json',
  ],
  hardware: [
    'esp32', 'esp8266', 'ratgdo32', 'arduino', 'raspberry pi', 'raspberry pi pico', 'stm32', 'vex edr', 'vex v5',
    'fuel cell', 'solar', '3d printing', 'soldering', 'pcb', 'sensors', 'motors', 'servos',
  ],
  cloud: [
    'cloud', 'github', 'github pages', 'github actions', 'git', 'firebase', 'netlify', 'vercel', 'cloudflare',
    'aws', 'aws ec2', 'aws s3', 'google cloud', 'azure', 'docker', 'linux', 'dns',
  ],
  concept: [
    'calculus', 'physics', 'statistics', 'pid', 'odometry', 'kinematics', 'prototyping', 'cad', 'control systems',
    'machine learning', 'networking',
  ],
  software: [
    'astro', 'hugo', 'react', 'vue', 'svelte', 'next.js', 'node.js', 'bun', 'vite', 'tailwind css', 'express',
    'home assistant', 'esphome', 'mqtt', 'fusion360', 'arcgis', 'figma', 'blender', 'vs code', 'cron',
  ],
};
