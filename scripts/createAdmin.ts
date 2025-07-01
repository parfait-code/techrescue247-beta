import { UsersService } from '../lib/services/users.service';

async function createAdmin() {
    try {
        const admin = await UsersService.create({
            name: 'Admin Techrescue247',
            email: 'admin@techrescue247.com',
            phone: '+237678830036',
            password: 'admin123',
            role: 'admin',
        });

        console.log('Admin créé avec succès:', admin.email);
        console.log('ID:', admin.id);
        process.exit(0);
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

// Exécuter le script
createAdmin();