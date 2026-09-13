import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n, { configureI18n } from '../i18n';

const LanguageContext = createContext(null);

const translations = {
    en: {
        'Home': 'Home', 'Subjects': 'Subjects', 'Assessments': 'Assessments', 'Create Subject': 'Create Subject',
        'My Subjects': 'My Subjects', 'Chat': 'Chat', 'Admin': 'Admin', 'Blog': 'Blog', 'Contact': 'Contact',
        'Collaborators': 'Collaborators', 'Get Started': 'Get Started', 'Dark': 'Dark', 'Green': 'Green',
        'Notifications': 'Notifications', 'Clear': 'Clear', 'No new notifications': 'No new notifications',
        'Profile': 'Profile', 'Settings': 'Settings', 'Logout': 'Logout', 'Login': 'Login', 'Register': 'Register',
        'Welcome Back': 'Welcome Back', 'Sign in to your Education Solution account': 'Sign in to your Education Solution account',
        'Create Account': 'Create Account', 'Join Us': 'Join Us', 'Submit to teacher': 'Submit to teacher',
        'New message': 'New message', 'New subject available': 'New subject available', 'New assessment posted': 'New assessment posted',
        'Message read': 'Message read', 'Subject read': 'Subject read',
        'Settings saved successfully!': 'Settings saved successfully!', 'Failed to save settings': 'Failed to save settings',
        'Thank you! Your message was received.': 'Thank you! Your message was received.',
        'Unable to submit your message. Please try again.': 'Unable to submit your message. Please try again.',
        'About Us': 'About Us', 'Mission': 'Mission', 'Vision': 'Vision', 'Team': 'Team', 'Careers': 'Careers',
        'Resources': 'Resources', 'Community': 'Community', 'Support': 'Support', 'Help Center': 'Help Center',
        'Contact Us': 'Contact Us', 'Training': 'Training', 'Feedback': 'Feedback', 'Global Collaborators': 'Global Collaborators',
        'Connecting teachers and students for efficient, collaborative learning experiences.': 'Connecting teachers and students for efficient, collaborative learning experiences.',
        'All rights reserved.': 'All rights reserved.', 'Empowering Education Globally': 'Empowering Education Globally',
        'We\'d love to hear from you. Get in touch with our team!': "We'd love to hear from you. Get in touch with our team!",
        'Email': 'Email', 'Phone': 'Phone', 'Location': 'Location', 'We respond within 24 hours': 'We respond within 24 hours',
        'Mon-Fri, 9AM-6PM EST': 'Mon-Fri, 9AM-6PM EST', 'Serving educators worldwide': 'Serving educators worldwide',
        'Send us a Message': 'Send us a Message', 'Full Name': 'Full Name', 'Email Address': 'Email Address',
        'Subject': 'Subject', 'Message': 'Message', 'Your name': 'Your name', 'What is this about?': 'What is this about?',
        'Your message here...': 'Your message here...', 'Sending...': 'Sending...', 'Send Message': 'Send Message',
        'Global Reach': 'Global Reach', 'Serving educators and students in 50+ countries': 'Serving educators and students in 50+ countries',
        'Response Times': 'Response Times', 'Business Hours': 'Business Hours',
        'Manage your preferences and account settings': 'Manage your preferences and account settings', 'Appearance': 'Appearance',
        'Switch between light and dark theme': 'Switch between light and dark theme', 'Change Password': 'Change Password',
        'Danger Zone': 'Danger Zone', 'Dark Mode': 'Dark Mode', 'Password': 'Password', 'Sign In': 'Sign In', 'Signing in...': 'Signing in...',
        "Don't have an account?": "Don't have an account?", 'Create one now': 'Create one now', 'Back to Home': 'Back to Home',
        'Email inquiries: 24 hours': 'Email inquiries: 24 hours', 'Phone support: Available daily': 'Phone support: Available daily',
        'Emergency support: 2 hours': 'Emergency support: 2 hours', 'Community forum: Real-time responses': 'Community forum: Real-time responses',
        'Password must be at least 6 characters': 'Password must be at least 6 characters', 'Login successful!': 'Login successful!',
        'Login failed': 'Login failed', 'Create your Education Solution account': 'Create your Education Solution account',
        'Registration successful! Redirecting to login...': 'Registration successful! Redirecting to login...', 'Registration failed': 'Registration failed',
        'Nationality': 'Nationality', 'Select your nationality': 'Select your nationality', 'Field of Interest': 'Field of Interest',
        'Select a field': 'Select a field', 'Choose the field you want to read subjects from': 'Choose the field you want to read subjects from',
        'Account Type': 'Account Type', 'Creating account...': 'Creating account...', 'Already have an account?': 'Already have an account?',
        'Sign in here': 'Sign in here', 'Welcome to': 'Welcome to', 'Connecting Teachers & Students for Exceptional Learning': 'Connecting Teachers & Students for Exceptional Learning',
        'Our mission is to empower educators and learners with a platform that supports real-time collaboration, resource sharing, and community building. Join thousands of students and teachers worldwide.': 'Our mission is to empower educators and learners with a platform that supports real-time collaboration, resource sharing, and community building. Join thousands of students and teachers worldwide.',
        'Go to Dashboard': 'Go to Dashboard', 'Why Choose Education Solution?': 'Why Choose Education Solution?', 'Our Vision': 'Our Vision', 'Objective': 'Objective',
        'Ready to Transform Your Learning?': 'Ready to Transform Your Learning?', 'Join our global learning community and start your educational journey today.': 'Join our global learning community and start your educational journey today.', 'Sign Up Today': 'Sign Up Today',
        'Real-time Chat': 'Real-time Chat', 'Connect with teachers and students instantly with our real-time messaging system': 'Connect with teachers and students instantly with our real-time messaging system', 'Smart Subjects': 'Smart Subjects', 'Create, share, and explore educational subjects with rich content support': 'Create, share, and explore educational subjects with rich content support', 'User Profiles': 'User Profiles', 'Build your learning profile with photos, achievements, and progress tracking': 'Build your learning profile with photos, achievements, and progress tracking', 'Responsive Design': 'Responsive Design', 'Learn from anywhere - seamless experience on all devices': 'Learn from anywhere - seamless experience on all devices',
        'To create an inclusive, accessible learning platform that bridges the gap between educators and learners worldwide, enabling transformative educational experiences.': 'To create an inclusive, accessible learning platform that bridges the gap between educators and learners worldwide, enabling transformative educational experiences.', 'Empower educators with tools to create engaging content, facilitate real-time communication, and track student progress while providing students with a collaborative learning environment.': 'Empower educators with tools to create engaging content, facilitate real-time communication, and track student progress while providing students with a collaborative learning environment.', 'Through partnerships with leading educational platforms like W3Schools and JavaTPoint, we ensure quality content delivery and continuous learning support for our community.': 'Through partnerships with leading educational platforms like W3Schools and JavaTPoint, we ensure quality content delivery and continuous learning support for our community.',
        'Our Mission': 'Our Mission', 'Empowering education through connection': 'Empowering education through connection', 'We build a collaborative learning environment where teachers and students can learn, share, and grow together.': 'We build a collaborative learning environment where teachers and students can learn, share, and grow together.', 'What we do': 'What we do', 'Education Solution connects educators, students, and resources in a single platform. We make it easier to share quality learning materials, conduct assessments, and maintain active communication across the teaching journey.': 'Education Solution connects educators, students, and resources in a single platform. We make it easier to share quality learning materials, conduct assessments, and maintain active communication across the teaching journey.', 'Why it matters': 'Why it matters', 'We believe access to quality education should be inclusive, practical, and community-driven. Our platform helps learners stay motivated while giving teachers the tools they need to guide progress effectively.': 'We believe access to quality education should be inclusive, practical, and community-driven. Our platform helps learners stay motivated while giving teachers the tools they need to guide progress effectively.'
    },
    fr: {
        'Home': 'Accueil', 'Subjects': 'Matières', 'Assessments': 'Évaluations', 'Create Subject': 'Créer une matière',
        'My Subjects': 'Mes matières', 'Chat': 'Discussion', 'Admin': 'Administration', 'Blog': 'Blog', 'Contact': 'Contact',
        'Collaborators': 'Collaborateurs', 'Get Started': 'Commencer', 'Dark': 'Sombre', 'Green': 'Vert',
        'Notifications': 'Notifications', 'Clear': 'Effacer', 'No new notifications': 'Aucune nouvelle notification',
        'Profile': 'Profil', 'Settings': 'Paramètres', 'Logout': 'Déconnexion', 'Login': 'Connexion', 'Register': 'Inscription',
        'Welcome Back': 'Bon retour', 'Sign in to your Education Solution account': 'Connectez-vous à votre compte Education Solution',
        'Create Account': 'Créer un compte', 'Join Us': 'Rejoignez-nous', 'Submit to teacher': 'Soumettre au professeur',
        'New message': 'Nouveau message', 'New subject available': 'Nouvelle matière disponible', 'New assessment posted': 'Nouvelle évaluation publiée',
        'Message read': 'Message lu', 'Subject read': 'Matière lue',
        'Settings saved successfully!': 'Paramètres enregistrés !', 'Failed to save settings': "Échec de l'enregistrement des paramètres",
        'Thank you! Your message was received.': 'Merci ! Votre message a été reçu.',
        'Unable to submit your message. Please try again.': 'Impossible d’envoyer votre message. Réessayez.',
        'About Us': 'À propos', 'Mission': 'Mission', 'Vision': 'Vision', 'Team': 'Équipe', 'Careers': 'Carrières',
        'Resources': 'Ressources', 'Community': 'Communauté', 'Support': 'Assistance', 'Help Center': 'Centre d’aide',
        'Contact Us': 'Nous contacter', 'Training': 'Formation', 'Feedback': 'Commentaires', 'Global Collaborators': 'Collaborateurs mondiaux',
        'Connecting teachers and students for efficient, collaborative learning experiences.': 'Nous rapprochons enseignants et élèves pour un apprentissage efficace et collaboratif.',
        'All rights reserved.': 'Tous droits réservés.', 'Empowering Education Globally': 'Donner du pouvoir à l’éducation mondiale',
        'We\'d love to hear from you. Get in touch with our team!': 'Nous serions ravis de vous entendre. Contactez notre équipe !',
        'Email': 'E-mail', 'Phone': 'Téléphone', 'Location': 'Lieu', 'We respond within 24 hours': 'Nous répondons sous 24 heures',
        'Mon-Fri, 9AM-6PM EST': 'Lun-ven, 9 h-18 h EST', 'Serving educators worldwide': 'Au service des enseignants du monde entier',
        'Send us a Message': 'Envoyez-nous un message', 'Full Name': 'Nom complet', 'Email Address': 'Adresse e-mail',
        'Subject': 'Objet', 'Message': 'Message', 'Your name': 'Votre nom', 'What is this about?': 'Quel est le sujet ?',
        'Your message here...': 'Votre message ici...', 'Sending...': 'Envoi...', 'Send Message': 'Envoyer le message',
        'Global Reach': 'Présence mondiale', 'Serving educators and students in 50+ countries': 'Au service des enseignants et élèves dans plus de 50 pays',
        'Response Times': 'Délais de réponse', 'Business Hours': 'Heures d’ouverture',
        'Manage your preferences and account settings': 'Gérez vos préférences et les paramètres de votre compte', 'Appearance': 'Apparence',
        'Switch between light and dark theme': 'Basculer entre les thèmes clair et sombre', 'Change Password': 'Modifier le mot de passe',
        'Danger Zone': 'Zone dangereuse', 'Dark Mode': 'Mode sombre', 'Password': 'Mot de passe', 'Sign In': 'Se connecter', 'Signing in...': 'Connexion...',
        "Don't have an account?": "Vous n’avez pas de compte ?", 'Create one now': 'Créez-en un maintenant', 'Back to Home': 'Retour à l’accueil',
        'Email inquiries: 24 hours': 'Demandes par e-mail : 24 heures', 'Phone support: Available daily': 'Assistance téléphonique : tous les jours',
        'Emergency support: 2 hours': 'Assistance urgente : 2 heures', 'Community forum: Real-time responses': 'Forum communautaire : réponses en temps réel',
        'Password must be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères', 'Login successful!': 'Connexion réussie !',
        'Login failed': 'Échec de la connexion', 'Create your Education Solution account': 'Créez votre compte Education Solution',
        'Registration successful! Redirecting to login...': 'Inscription réussie ! Redirection vers la connexion...', 'Registration failed': 'Échec de l’inscription',
        'Nationality': 'Nationalité', 'Select your nationality': 'Sélectionnez votre nationalité', 'Field of Interest': 'Domaine d’intérêt',
        'Select a field': 'Sélectionnez un domaine', 'Choose the field you want to read subjects from': 'Choisissez le domaine dont vous souhaitez consulter les matières',
        'Account Type': 'Type de compte', 'Creating account...': 'Création du compte...', 'Already have an account?': 'Vous avez déjà un compte ?',
        'Sign in here': 'Connectez-vous ici', 'Welcome to': 'Bienvenue sur', 'Connecting Teachers & Students for Exceptional Learning': 'Relier enseignants et élèves pour un apprentissage exceptionnel',
        'Our mission is to empower educators and learners with a platform that supports real-time collaboration, resource sharing, and community building. Join thousands of students and teachers worldwide.': 'Notre mission est de donner aux enseignants et aux apprenants une plateforme de collaboration en temps réel, de partage de ressources et de communauté. Rejoignez des milliers d’élèves et d’enseignants dans le monde.',
        'Go to Dashboard': 'Accéder au tableau de bord', 'Why Choose Education Solution?': 'Pourquoi choisir Education Solution ?', 'Our Vision': 'Notre vision', 'Objective': 'Objectif', 'Ready to Transform Your Learning?': 'Prêt à transformer votre apprentissage ?', 'Join our global learning community and start your educational journey today.': 'Rejoignez notre communauté mondiale et commencez votre parcours éducatif dès aujourd’hui.', 'Sign Up Today': 'Inscrivez-vous aujourd’hui',
        'Real-time Chat': 'Discussion en temps réel', 'Connect with teachers and students instantly with our real-time messaging system': 'Échangez instantanément avec les enseignants et les élèves grâce à notre messagerie en temps réel', 'Smart Subjects': 'Matières intelligentes', 'Create, share, and explore educational subjects with rich content support': 'Créez, partagez et explorez des matières avec un contenu riche', 'User Profiles': 'Profils utilisateurs', 'Build your learning profile with photos, achievements, and progress tracking': 'Construisez votre profil d’apprentissage avec photos, réussites et suivi des progrès', 'Responsive Design': 'Design responsive', 'Learn from anywhere - seamless experience on all devices': 'Apprenez partout grâce à une expérience fluide sur tous les appareils',
        'To create an inclusive, accessible learning platform that bridges the gap between educators and learners worldwide, enabling transformative educational experiences.': 'Créer une plateforme inclusive et accessible qui rapproche enseignants et apprenants dans le monde entier.', 'Empower educators with tools to create engaging content, facilitate real-time communication, and track student progress while providing students with a collaborative learning environment.': 'Donner aux enseignants des outils pour créer du contenu, communiquer en temps réel et suivre les progrès des élèves.', 'Through partnerships with leading educational platforms like W3Schools and JavaTPoint, we ensure quality content delivery and continuous learning support for our community.': 'Grâce à nos partenariats avec W3Schools et JavaTPoint, nous garantissons un contenu de qualité et un accompagnement continu.',
        'Our Mission': 'Notre mission', 'Empowering education through connection': 'Faire progresser l’éducation par la connexion', 'We build a collaborative learning environment where teachers and students can learn, share, and grow together.': 'Nous créons un environnement collaboratif où enseignants et élèves apprennent, partagent et progressent ensemble.', 'What we do': 'Ce que nous faisons', 'Education Solution connects educators, students, and resources in a single platform. We make it easier to share quality learning materials, conduct assessments, and maintain active communication across the teaching journey.': 'Education Solution réunit enseignants, élèves et ressources sur une seule plateforme pour partager des supports, réaliser des évaluations et communiquer activement.', 'Why it matters': 'Pourquoi c’est important', 'We believe access to quality education should be inclusive, practical, and community-driven. Our platform helps learners stay motivated while giving teachers the tools they need to guide progress effectively.': 'Nous croyons que l’accès à une éducation de qualité doit être inclusif, pratique et porté par la communauté.'
    },
    es: {
        'Home': 'Inicio', 'Subjects': 'Asignaturas', 'Assessments': 'Evaluaciones', 'Create Subject': 'Crear asignatura',
        'My Subjects': 'Mis asignaturas', 'Chat': 'Chat', 'Admin': 'Administración', 'Blog': 'Blog', 'Contact': 'Contacto',
        'Collaborators': 'Colaboradores', 'Get Started': 'Comenzar', 'Dark': 'Oscuro', 'Green': 'Verde',
        'Notifications': 'Notificaciones', 'Clear': 'Borrar', 'No new notifications': 'No hay notificaciones nuevas',
        'Profile': 'Perfil', 'Settings': 'Configuración', 'Logout': 'Cerrar sesión', 'Login': 'Iniciar sesión', 'Register': 'Registrarse',
        'Welcome Back': 'Bienvenido de nuevo', 'Sign in to your Education Solution account': 'Inicia sesión en tu cuenta de Education Solution',
        'Create Account': 'Crear cuenta', 'Join Us': 'Únete', 'Submit to teacher': 'Enviar al profesor',
        'New message': 'Nuevo mensaje', 'New subject available': 'Nueva asignatura disponible', 'New assessment posted': 'Nueva evaluación publicada',
        'Message read': 'Mensaje leído', 'Subject read': 'Asignatura leída',
        'Settings saved successfully!': '¡Configuración guardada!', 'Failed to save settings': 'No se pudo guardar la configuración',
        'Thank you! Your message was received.': '¡Gracias! Tu mensaje fue recibido.',
        'Unable to submit your message. Please try again.': 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
        'About Us': 'Sobre nosotros', 'Mission': 'Misión', 'Vision': 'Visión', 'Team': 'Equipo', 'Careers': 'Carreras',
        'Resources': 'Recursos', 'Community': 'Comunidad', 'Support': 'Soporte', 'Help Center': 'Centro de ayuda',
        'Contact Us': 'Contáctanos', 'Training': 'Formación', 'Feedback': 'Comentarios', 'Global Collaborators': 'Colaboradores globales',
        'Connecting teachers and students for efficient, collaborative learning experiences.': 'Conectamos a docentes y estudiantes para experiencias de aprendizaje eficientes y colaborativas.',
        'All rights reserved.': 'Todos los derechos reservados.', 'Empowering Education Globally': 'Impulsando la educación a nivel mundial',
        'We\'d love to hear from you. Get in touch with our team!': 'Nos encantará saber de ti. ¡Contacta con nuestro equipo!',
        'Email': 'Correo electrónico', 'Phone': 'Teléfono', 'Location': 'Ubicación', 'We respond within 24 hours': 'Respondemos en 24 horas',
        'Mon-Fri, 9AM-6PM EST': 'Lun-vie, 9:00-18:00 EST', 'Serving educators worldwide': 'Al servicio de docentes de todo el mundo',
        'Send us a Message': 'Envíanos un mensaje', 'Full Name': 'Nombre completo', 'Email Address': 'Correo electrónico',
        'Subject': 'Asunto', 'Message': 'Mensaje', 'Your name': 'Tu nombre', 'What is this about?': '¿De qué se trata?',
        'Your message here...': 'Escribe tu mensaje aquí...', 'Sending...': 'Enviando...', 'Send Message': 'Enviar mensaje',
        'Global Reach': 'Alcance global', 'Serving educators and students in 50+ countries': 'Servimos a docentes y estudiantes en más de 50 países',
        'Response Times': 'Tiempos de respuesta', 'Business Hours': 'Horario comercial',
        'Manage your preferences and account settings': 'Administra tus preferencias y la configuración de tu cuenta', 'Appearance': 'Apariencia',
        'Switch between light and dark theme': 'Cambia entre el tema claro y oscuro', 'Change Password': 'Cambiar contraseña',
        'Danger Zone': 'Zona de peligro', 'Dark Mode': 'Modo oscuro', 'Password': 'Contraseña', 'Sign In': 'Iniciar sesión', 'Signing in...': 'Iniciando sesión...',
        "Don't have an account?": '¿No tienes una cuenta?', 'Create one now': 'Créala ahora', 'Back to Home': 'Volver al inicio',
        'Email inquiries: 24 hours': 'Consultas por correo: 24 horas', 'Phone support: Available daily': 'Soporte telefónico: disponible a diario',
        'Emergency support: 2 hours': 'Soporte de emergencia: 2 horas', 'Community forum: Real-time responses': 'Foro comunitario: respuestas en tiempo real',
        'Password must be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres', 'Login successful!': '¡Inicio de sesión correcto!',
        'Login failed': 'Error al iniciar sesión', 'Create your Education Solution account': 'Crea tu cuenta de Education Solution',
        'Registration successful! Redirecting to login...': '¡Registro correcto! Redirigiendo al inicio de sesión...', 'Registration failed': 'Error en el registro',
        'Nationality': 'Nacionalidad', 'Select your nationality': 'Selecciona tu nacionalidad', 'Field of Interest': 'Área de interés',
        'Select a field': 'Selecciona un área', 'Choose the field you want to read subjects from': 'Elige el área cuyos contenidos quieres consultar',
        'Account Type': 'Tipo de cuenta', 'Creating account...': 'Creando cuenta...', 'Already have an account?': '¿Ya tienes una cuenta?',
        'Sign in here': 'Inicia sesión aquí', 'Welcome to': 'Bienvenido a', 'Connecting Teachers & Students for Exceptional Learning': 'Conectando docentes y estudiantes para un aprendizaje excepcional',
        'Our mission is to empower educators and learners with a platform that supports real-time collaboration, resource sharing, and community building. Join thousands of students and teachers worldwide.': 'Nuestra misión es ofrecer a docentes y estudiantes una plataforma de colaboración en tiempo real, intercambio de recursos y comunidad. Únete a miles de estudiantes y docentes de todo el mundo.',
        'Go to Dashboard': 'Ir al panel', 'Why Choose Education Solution?': '¿Por qué elegir Education Solution?', 'Our Vision': 'Nuestra visión', 'Objective': 'Objetivo', 'Ready to Transform Your Learning?': '¿Listo para transformar tu aprendizaje?', 'Join our global learning community and start your educational journey today.': 'Únete a nuestra comunidad mundial y comienza hoy tu recorrido educativo.', 'Sign Up Today': 'Regístrate hoy',
        'Real-time Chat': 'Chat en tiempo real', 'Connect with teachers and students instantly with our real-time messaging system': 'Conecta al instante con docentes y estudiantes mediante nuestro sistema de mensajería en tiempo real', 'Smart Subjects': 'Asignaturas inteligentes', 'Create, share, and explore educational subjects with rich content support': 'Crea, comparte y explora asignaturas con contenido enriquecido', 'User Profiles': 'Perfiles de usuario', 'Build your learning profile with photos, achievements, and progress tracking': 'Crea tu perfil de aprendizaje con fotos, logros y seguimiento del progreso', 'Responsive Design': 'Diseño adaptable', 'Learn from anywhere - seamless experience on all devices': 'Aprende desde cualquier lugar con una experiencia fluida en todos los dispositivos',
        'To create an inclusive, accessible learning platform that bridges the gap between educators and learners worldwide, enabling transformative educational experiences.': 'Crear una plataforma inclusiva y accesible que conecte a docentes y estudiantes de todo el mundo.', 'Empower educators with tools to create engaging content, facilitate real-time communication, and track student progress while providing students with a collaborative learning environment.': 'Dar a los docentes herramientas para crear contenido, comunicarse en tiempo real y seguir el progreso estudiantil.', 'Through partnerships with leading educational platforms like W3Schools and JavaTPoint, we ensure quality content delivery and continuous learning support for our community.': 'Con alianzas con plataformas como W3Schools y JavaTPoint, garantizamos contenido de calidad y apoyo continuo.',
        'Our Mission': 'Nuestra misión', 'Empowering education through connection': 'Impulsar la educación mediante la conexión', 'We build a collaborative learning environment where teachers and students can learn, share, and grow together.': 'Creamos un entorno colaborativo donde docentes y estudiantes aprenden, comparten y crecen juntos.', 'What we do': 'Lo que hacemos', 'Education Solution connects educators, students, and resources in a single platform. We make it easier to share quality learning materials, conduct assessments, and maintain active communication across the teaching journey.': 'Education Solution conecta docentes, estudiantes y recursos en una sola plataforma para compartir materiales, realizar evaluaciones y mantener una comunicación activa.', 'Why it matters': 'Por qué importa', 'We believe access to quality education should be inclusive, practical, and community-driven. Our platform helps learners stay motivated while giving teachers the tools they need to guide progress effectively.': 'Creemos que el acceso a una educación de calidad debe ser inclusivo, práctico y comunitario.'
    }
};

const supplementalTranslations = {
    fr: {
        'A world where learning is connected, accessible, and inspiring': 'Un monde où l’apprentissage est connecté, accessible et inspirant',
        'We aim to become a global reference for modern education by combining technology, collaboration, and practical learning support.': 'Nous voulons devenir une référence mondiale de l’éducation moderne en combinant technologie, collaboration et accompagnement pratique.',
        'Our objective': 'Notre objectif',
        'To empower educators with digital tools for content delivery, assessment management, and student engagement while giving learners a collaborative environment to grow.': 'Donner aux enseignants des outils numériques pour le contenu, les évaluations et l’engagement des élèves, tout en offrant aux apprenants un environnement collaboratif.',
        'Inclusive learning': 'Apprentissage inclusif', 'Create a welcoming space for teachers and students from different backgrounds and regions.': 'Créer un espace accueillant pour les enseignants et élèves de tous horizons.',
        'Practical support': 'Accompagnement pratique', 'Combine tools, guidance, and learning resources to improve everyday teaching and study experiences.': 'Associer outils, conseils et ressources pour améliorer l’enseignement et l’apprentissage au quotidien.',
        'Global impact': 'Impact mondial', 'Scale educational support through partnerships and community learning networks worldwide.': 'Développer l’accompagnement éducatif grâce aux partenariats et aux réseaux d’apprentissage.',
        'Build skills that improve learning outcomes': 'Développer des compétences qui améliorent les résultats d’apprentissage', 'Access practical resources, guided learning paths, and support designed for teachers and students.': 'Accédez à des ressources pratiques, des parcours guidés et un accompagnement pour enseignants et élèves.',
        'Teaching Essentials': 'Fondamentaux de l’enseignement', 'Learn how to organize classes, create engaging content, and manage learner progress effectively.': 'Apprenez à organiser les cours, créer du contenu attrayant et suivre efficacement les progrès.',
        'Assessment Strategies': 'Stratégies d’évaluation', 'Explore practical ways to evaluate performance, give feedback, and support student improvement.': 'Découvrez des méthodes pratiques pour évaluer, donner un retour et soutenir les progrès.',
        'Digital Collaboration': 'Collaboration numérique', 'Use communication and sharing tools to build stronger connections with students and peers.': 'Utilisez les outils de communication et de partage pour renforcer les liens.',
        'Career Readiness': 'Préparation professionnelle', 'Develop the skills needed to learn and teach in a modern, technology-driven environment.': 'Développez les compétences nécessaires dans un environnement moderne et technologique.',
        'We’re here to help': 'Nous sommes là pour vous aider', 'Find guidance for account access, subjects, assessments, and general platform support.': 'Trouvez de l’aide pour votre compte, les matières, les évaluations et la plateforme.',
        'How do I access my account?': 'Comment accéder à mon compte ?', 'Use the login page and enter the email and password tied to your teacher or student account.': 'Utilisez la page de connexion avec l’e-mail et le mot de passe de votre compte.',
        'Can I create or manage subjects?': 'Puis-je créer ou gérer des matières ?', 'Teachers can create and manage teaching materials from their dashboard, while students can view and access available subjects.': 'Les enseignants créent et gèrent leurs supports depuis leur tableau de bord ; les élèves consultent les matières disponibles.',
        'Where do I ask for support?': 'Où demander de l’aide ?', 'You can contact our support team through the Contact page or email us directly at support@educationsolution.com.': 'Contactez notre équipe depuis la page Contact ou à support@educationsolution.com.',
        'How do assessments work?': 'Comment fonctionnent les évaluations ?', 'Students can submit work and receive feedback, while teachers can review submissions and assign marks in the assessment dashboard.': 'Les élèves remettent leur travail et reçoivent des retours ; les enseignants évaluent les travaux depuis leur tableau de bord.',
        'Our Blog': 'Notre blog', 'Insights, tips, and stories from educators and learners around the world': 'Idées, conseils et histoires d’enseignants et d’apprenants du monde entier', 'Search articles...': 'Rechercher des articles...', 'All Articles': 'Tous les articles', 'Education': 'Éducation', 'Teaching': 'Enseignement', 'Collaboration': 'Collaboration', 'Technology': 'Technologie', 'Success Stories': 'Histoires de réussite', 'By': 'Par', 'Read More': 'Lire la suite', 'No articles found. Try adjusting your search or filters.': 'Aucun article trouvé. Modifiez votre recherche ou vos filtres.', 'Our Global Collaborators': 'Nos collaborateurs mondiaux', 'Partnering with leading educational platforms to enhance learning experiences': 'Nous collaborons avec des plateformes éducatives de premier plan pour enrichir l’apprentissage', 'Specialties': 'Spécialités', 'Why Our Partnerships Matter': 'Pourquoi nos partenariats comptent', 'What Our Partnerships Provide': 'Ce que nos partenariats offrent', 'Join Our Learning Community': 'Rejoignez notre communauté d’apprentissage', 'Access world-class educational content through our collaborative network': 'Accédez à du contenu éducatif de niveau mondial grâce à notre réseau', 'Get Started Today': 'Commencez aujourd’hui', 'Please login to access chat': 'Veuillez vous connecter pour accéder à la discussion', 'Students': 'Élèves', 'Teachers': 'Enseignants', 'total': 'au total', 'Loading users...': 'Chargement des utilisateurs...', 'No': 'Aucun', 'students': 'élève', 'teachers': 'enseignant', 'found': 'trouvé', 'Online': 'En ligne', 'Offline': 'Hors ligne', 'Loading messages...': 'Chargement des messages...', 'No messages yet.': 'Aucun message pour le moment.', 'Start a conversation!': 'Commencez une conversation !', 'is typing...': 'écrit...', 'Failed to load users': 'Échec du chargement des utilisateurs', 'Failed to load messages': 'Échec du chargement des messages', 'Please select a PDF file to upload': 'Sélectionnez un fichier PDF à importer', 'Subject created successfully!': 'Matière créée avec succès !', 'Failed to create subject': 'Échec de la création de la matière', 'Back to My Subjects': 'Retour à mes matières', 'Create New Subject': 'Créer une nouvelle matière', 'Upload your subject content and choose the field/sector it belongs to': 'Importez le contenu de votre matière et choisissez son domaine', 'Subject Title': 'Titre de la matière', 'e.g. Introduction to Web Development': 'ex. Introduction au développement web', 'Field / Sector': 'Domaine / secteur', 'Students will read subjects according to the field you select.': 'Les élèves consulteront les matières selon le domaine choisi.', 'Subject Content': 'Contenu de la matière', 'Use text description': 'Utiliser une description texte', 'Upload PDF instead': 'Importer un PDF', 'Write the subject description/content here...': 'Écrivez la description ou le contenu ici...', 'Click to choose a PDF file': 'Cliquez pour choisir un fichier PDF', 'PDF files up to 20MB': 'Fichiers PDF jusqu’à 20 Mo', 'ready to upload': 'prêt à importer', 'Creating...': 'Création...', 'Cancel': 'Annuler'
    },
    es: {
        'A world where learning is connected, accessible, and inspiring': 'Un mundo donde el aprendizaje está conectado, accesible e inspirador',
        'We aim to become a global reference for modern education by combining technology, collaboration, and practical learning support.': 'Queremos ser una referencia mundial de la educación moderna combinando tecnología, colaboración y apoyo práctico.',
        'Our objective': 'Nuestro objetivo',
        'To empower educators with digital tools for content delivery, assessment management, and student engagement while giving learners a collaborative environment to grow.': 'Dar a los docentes herramientas digitales para contenidos, evaluaciones y participación, y ofrecer a los estudiantes un entorno colaborativo.',
        'Inclusive learning': 'Aprendizaje inclusivo', 'Create a welcoming space for teachers and students from different backgrounds and regions.': 'Crear un espacio acogedor para docentes y estudiantes de distintos lugares.',
        'Practical support': 'Apoyo práctico', 'Combine tools, guidance, and learning resources to improve everyday teaching and study experiences.': 'Combinar herramientas, orientación y recursos para mejorar la enseñanza y el estudio diario.',
        'Global impact': 'Impacto global', 'Scale educational support through partnerships and community learning networks worldwide.': 'Ampliar el apoyo educativo mediante alianzas y redes comunitarias de aprendizaje.',
        'Build skills that improve learning outcomes': 'Desarrolla habilidades que mejoren los resultados de aprendizaje', 'Access practical resources, guided learning paths, and support designed for teachers and students.': 'Accede a recursos prácticos, rutas guiadas y apoyo para docentes y estudiantes.',
        'Teaching Essentials': 'Fundamentos de enseñanza', 'Learn how to organize classes, create engaging content, and manage learner progress effectively.': 'Aprende a organizar clases, crear contenido atractivo y gestionar el progreso.',
        'Assessment Strategies': 'Estrategias de evaluación', 'Explore practical ways to evaluate performance, give feedback, and support student improvement.': 'Explora formas prácticas de evaluar, dar comentarios y apoyar la mejora.',
        'Digital Collaboration': 'Colaboración digital', 'Use communication and sharing tools to build stronger connections with students and peers.': 'Usa herramientas de comunicación y uso compartido para fortalecer las conexiones.',
        'Career Readiness': 'Preparación profesional', 'Develop the skills needed to learn and teach in a modern, technology-driven environment.': 'Desarrolla las habilidades necesarias en un entorno moderno y tecnológico.',
        'We’re here to help': 'Estamos aquí para ayudarte', 'Find guidance for account access, subjects, assessments, and general platform support.': 'Encuentra orientación sobre cuentas, asignaturas, evaluaciones y soporte.',
        'How do I access my account?': '¿Cómo accedo a mi cuenta?', 'Use the login page and enter the email and password tied to your teacher or student account.': 'Usa la página de inicio de sesión con el correo y la contraseña de tu cuenta.',
        'Can I create or manage subjects?': '¿Puedo crear o gestionar asignaturas?', 'Teachers can create and manage teaching materials from their dashboard, while students can view and access available subjects.': 'Los docentes crean y gestionan materiales desde su panel; los estudiantes consultan las asignaturas disponibles.',
        'Where do I ask for support?': '¿Dónde pido ayuda?', 'You can contact our support team through the Contact page or email us directly at support@educationsolution.com.': 'Contacta con soporte desde la página Contacto o en support@educationsolution.com.',
        'How do assessments work?': '¿Cómo funcionan las evaluaciones?', 'Students can submit work and receive feedback, while teachers can review submissions and assign marks in the assessment dashboard.': 'Los estudiantes entregan trabajos y reciben comentarios; los docentes revisan y califican desde el panel.',
        'Our Blog': 'Nuestro blog', 'Insights, tips, and stories from educators and learners around the world': 'Ideas, consejos e historias de docentes y estudiantes de todo el mundo', 'Search articles...': 'Buscar artículos...', 'All Articles': 'Todos los artículos', 'Education': 'Educación', 'Teaching': 'Enseñanza', 'Collaboration': 'Colaboración', 'Technology': 'Tecnología', 'Success Stories': 'Historias de éxito', 'By': 'Por', 'Read More': 'Leer más', 'No articles found. Try adjusting your search or filters.': 'No se encontraron artículos. Ajusta la búsqueda o los filtros.', 'Our Global Collaborators': 'Nuestros colaboradores globales', 'Partnering with leading educational platforms to enhance learning experiences': 'Colaboramos con plataformas educativas líderes para mejorar el aprendizaje', 'Specialties': 'Especialidades', 'Why Our Partnerships Matter': 'Por qué importan nuestras alianzas', 'What Our Partnerships Provide': 'Qué ofrecen nuestras alianzas', 'Join Our Learning Community': 'Únete a nuestra comunidad de aprendizaje', 'Access world-class educational content through our collaborative network': 'Accede a contenido educativo de nivel mundial mediante nuestra red', 'Get Started Today': 'Comienza hoy', 'Please login to access chat': 'Inicia sesión para acceder al chat', 'Students': 'Estudiantes', 'Teachers': 'Docentes', 'total': 'en total', 'Loading users...': 'Cargando usuarios...', 'No': 'No hay', 'students': 'estudiantes', 'teachers': 'docentes', 'found': 'encontrados', 'Online': 'En línea', 'Offline': 'Desconectado', 'Loading messages...': 'Cargando mensajes...', 'No messages yet.': 'Aún no hay mensajes.', 'Start a conversation!': '¡Inicia una conversación!', 'is typing...': 'está escribiendo...', 'Failed to load users': 'No se pudieron cargar los usuarios', 'Failed to load messages': 'No se pudieron cargar los mensajes', 'Please select a PDF file to upload': 'Selecciona un archivo PDF para subirlo', 'Subject created successfully!': '¡Asignatura creada correctamente!', 'Failed to create subject': 'No se pudo crear la asignatura', 'Back to My Subjects': 'Volver a mis asignaturas', 'Create New Subject': 'Crear nueva asignatura', 'Upload your subject content and choose the field/sector it belongs to': 'Sube el contenido y elige el área a la que pertenece', 'Subject Title': 'Título de la asignatura', 'e.g. Introduction to Web Development': 'ej. Introducción al desarrollo web', 'Field / Sector': 'Área / sector', 'Students will read subjects according to the field you select.': 'Los estudiantes verán asignaturas según el área seleccionada.', 'Subject Content': 'Contenido de la asignatura', 'Use text description': 'Usar descripción de texto', 'Upload PDF instead': 'Subir PDF', 'Write the subject description/content here...': 'Escribe aquí la descripción o contenido...', 'Click to choose a PDF file': 'Haz clic para elegir un PDF', 'PDF files up to 20MB': 'Archivos PDF de hasta 20 MB', 'ready to upload': 'listo para subir', 'Creating...': 'Creando...', 'Cancel': 'Cancelar'
    }
};

const resources = Object.fromEntries(
    Object.keys(translations).map((language) => [language, {
        translation: {
            ...translations[language],
            ...supplementalTranslations[language]
        }
    }])
);

const storedLanguage = localStorage.getItem('lang');
const initialLanguage = resources[storedLanguage] ? storedLanguage : 'en';

configureI18n(resources, initialLanguage);

export const LanguageProvider = ({ children }) => {
    const [lang, setLangState] = useState(initialLanguage);

    const setLang = (nextLang) => {
        const nextLanguage = resources[nextLang] ? nextLang : 'en';
        setLangState(nextLanguage);
        i18n.changeLanguage(nextLanguage);
    };

    useEffect(() => {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const value = {
        lang,
        setLang,
        languages: Object.keys(resources),
        t: (key, variables = {}) => i18n.t(key, variables)
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
