export const fieldGroups = [
    {
        id: 'technology',
        label: 'Technology & ICT',
        icon: '🛰️',
        description: 'Fields and sectors related to technology and information communication technology',
        fields: [
            { value: 'ict-multimedia', label: 'ICT & Multimedia', icon: '💻', description: 'Computing, digital media, and communication technology' },
            { value: 'networking', label: 'Computer Networking', icon: '🛜', description: 'Network design, administration, and infrastructure' },
            { value: 'cybersecurity', label: 'Cyber Security', icon: '🔐', description: 'Protecting systems, networks, and data from threats' },
            { value: 'database', label: 'Database Management', icon: '🗄️', description: 'Designing and managing structured data systems' },
            { value: 'graphic-design', label: 'Graphic & Digital Design', icon: '🎨', description: 'Visual design for print and digital media' },
            { value: 'cloud-computing', label: 'Cloud Computing', icon: '☁️', description: 'Cloud services, deployment, and infrastructure' }
        ]
    },
    {
        id: 'programming',
        label: 'Programming & Web Development',
        icon: '🧑‍💻',
        description: 'Every field or sector related to programming and web development',
        fields: [
            { value: 'programming', label: 'Programming', icon: '⌨️', description: 'Core coding skills, algorithms, and problem solving' },
            { value: 'web-development', label: 'Web Development', icon: '🌐', description: 'Designing and building websites and web applications' },
            { value: 'software-development', label: 'Software Development', icon: '📦', description: 'Building applications with modern programming languages' },
            { value: 'mobile-app', label: 'Mobile App Development', icon: '📱', description: 'Creating applications for mobile devices' },
            { value: 'data-science', label: 'Data Science & AI', icon: '🤖', description: 'Data analysis, machine learning, and artificial intelligence' }
        ]
    }
];

export const fieldOptions = fieldGroups.reduce(
    (acc, group) => acc.concat(group.fields.map(field => ({ ...field, group: group.id }))),
    []
);

export const getFieldLabel = (value) => {
    const field = fieldOptions.find((f) => f.value === value);
    return field ? field.label : value || 'General';
};

export const getFieldIcon = (value) => {
    const field = fieldOptions.find((f) => f.value === value);
    return field ? field.icon : '📘';
};
