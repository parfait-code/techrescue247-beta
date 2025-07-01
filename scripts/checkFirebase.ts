import { adminDb, adminAuth, COLLECTIONS } from '../lib/firebase-admin';

async function checkFirebaseConfig() {
    console.log('🔍 Vérification de la configuration Firebase...\n');

    const checks = {
        auth: false,
        firestore: false,
        collections: {
            users: false,
            tickets: false,
            messages: false,
        },
    };

    try {
        // Vérifier Firebase Auth Admin
        console.log('📌 Test Firebase Auth Admin...');
        try {
            const users = await adminAuth.listUsers(1);
            console.log('✅ Firebase Auth Admin : OK');
            checks.auth = true;
        } catch (error: any) {
            console.error('❌ Firebase Auth Admin : ERREUR');
            console.error(`   ${error.message}`);
        }

        // Vérifier Firestore
        console.log('\n📌 Test Firestore...');
        try {
            // Tester la connexion en essayant de lire une collection
            const testCollection = await adminDb.collection('_test').limit(1).get();
            console.log('✅ Firestore : OK');
            checks.firestore = true;
        } catch (error: any) {
            console.error('❌ Firestore : ERREUR');
            console.error(`   ${error.message}`);
        }

        // Vérifier les collections
        if (checks.firestore) {
            console.log('\n📌 Vérification des collections...');

            for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
                try {
                    const snapshot = await adminDb.collection(collectionName).limit(1).get();
                    const count = (await adminDb.collection(collectionName).count().get()).data().count;

                    console.log(`✅ Collection '${collectionName}' : OK (${count} documents)`);
                    checks.collections[key.toLowerCase() as keyof typeof checks.collections] = true;
                } catch (error: any) {
                    console.error(`❌ Collection '${collectionName}' : ERREUR`);
                    console.error(`   ${error.message}`);
                }
            }
        }

        // Vérifier les variables d'environnement
        console.log('\n📌 Variables d\'environnement...');
        const envVars = {
            'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID,
            'FIREBASE_CLIENT_EMAIL': process.env.FIREBASE_CLIENT_EMAIL,
            'FIREBASE_PRIVATE_KEY': process.env.FIREBASE_PRIVATE_KEY ? '✅ Défini' : undefined,
            'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            'JWT_SECRET': process.env.JWT_SECRET ? '✅ Défini' : undefined,
        };

        let allEnvVarsSet = true;
        for (const [key, value] of Object.entries(envVars)) {
            if (value) {
                console.log(`✅ ${key} : ${key.includes('KEY') || key.includes('SECRET') ? '***' : value}`);
            } else {
                console.error(`❌ ${key} : NON DÉFINI`);
                allEnvVarsSet = false;
            }
        }

        // Résumé
        console.log('\n📊 RÉSUMÉ :');
        const allChecks = checks.auth && checks.firestore && Object.values(checks.collections).every(v => v) && allEnvVarsSet;

        if (allChecks) {
            console.log('✅ Toutes les vérifications sont passées ! Firebase est correctement configuré.');
        } else {
            console.log('❌ Certaines vérifications ont échoué. Veuillez corriger les erreurs ci-dessus.');

            if (!allEnvVarsSet) {
                console.log('\n💡 Conseil : Assurez-vous d\'avoir copié .env.local.example vers .env.local et rempli toutes les valeurs.');
            }
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error);
    }

    process.exit(0);
}

// Exécuter la vérification
checkFirebaseConfig();