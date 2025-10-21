        let gold = 500;
        let currentRod = 'rod1';
        let fishingSpeed = 1;
        let totalFishCaught = 0;
        let currentLocation = 'river';
        let unlockedLocations = ['river'];
        let isFishing = false;
        let isAutoFishing = false;
        let inventory = {};
        let activeBoosters = {};
        let activeBaits = {};
        let lockedFish = {};
        let ownedRods = ['rod1'];

        // ==================== VERSION MANAGEMENT ====================
        const GAME_VERSION = '1.0.INITIAL'; // UPDATE INI SETIAP DEPLOY

        function ensureVersionCompatibility() {
            console.log('🔧 Checking version compatibility...');
            
            const savedVersion = localStorage.getItem('game_version');
            const saveData = localStorage.getItem('mancing_mania_save');
            
            // Jika pertama kali main atau version berbeda
            if (!savedVersion || savedVersion !== GAME_VERSION) {
                console.log(`🔄 Migrating from ${savedVersion || 'no version'} to ${GAME_VERSION}`);
                
                // Backup data sebelum update
                if (saveData) {
                    const backupKey = `backup_v${savedVersion || '1.0'}_${Date.now()}`;
                    localStorage.setItem(backupKey, saveData);
                    console.log('💾 Backup created:', backupKey);
                }
                
                // Run migration scripts jika perlu
                if (savedVersion) {
                    runDataMigration(savedVersion, GAME_VERSION);
                }
                
                // Update version
                localStorage.setItem('game_version', GAME_VERSION);
                console.log('✅ Version updated to:', GAME_VERSION);
            } else {
                console.log('✅ Version compatible:', GAME_VERSION);
            }
        }

        function runDataMigration(oldVersion, newVersion) {
            console.log(`🔄 Running migration from ${oldVersion} to ${newVersion}`);
            
            // Migration untuk versi spesifik
            if (oldVersion === '1.0.0') {
                migrateFromV1ToV2();
            }
            // Tambahkan migration lain sesuai kebutuhan
            
            console.log('✅ Migration completed');
        }

        function migrateFromV1ToV2() {
            // Contoh migration dari versi 1.0 ke 2.0
            const saveData = localStorage.getItem('mancing_mania_save');
            if (!saveData) return;
            
            try {
                const data = JSON.parse(saveData);
                
                // Tambahkan field baru jika tidak ada
                if (!data.ownedRods) data.ownedRods = ['rod1'];
                if (!data.lockedFish) data.lockedFish = {};
                if (!data.activeBaits) data.activeBaits = {};
                
                // Update save data
                localStorage.setItem('mancing_mania_save', JSON.stringify(data));
                console.log('✅ V1 to V2 migration successful');
            } catch (error) {
                console.error('❌ Migration error:', error);
            }
        }

        function createEmergencyBackup() {
            const saveData = localStorage.getItem('mancing_mania_save');
            if (saveData) {
                const backupKey = `emergency_backup_${Date.now()}`;
                localStorage.setItem(backupKey, saveData);
                console.log('🛡️ Emergency backup created:', backupKey);
                return backupKey;
            }
            return null;
        }

        // Auto-backup setiap 10 menit
        setInterval(createEmergencyBackup, 10 * 60 * 1000);
        
        // Equipment and Boosters Data - VERSI BARU
        const shopItems = {
            // Pancingan - SEKARANG PAKAI LUCK
            rod1: { 
                name: "Joran Bambu", 
                price: 0, 
                type: "rod", 
                level: 1, 
                speed: 1.0,
                luck: 0,  // +0% luck
                rarity: "common"
            },
            rod2: { 
                name: "Joran Besi", 
                price: 10000, 
                type: "rod", 
                level: 2, 
                speed: 1.5,
                luck: 10,  // +10% luck
                rarity: "uncommon"
            },
            rod3: { 
                name: "Joran Titanium", 
                price: 50000, 
                type: "rod", 
                level: 3, 
                speed: 2.0,
                luck: 25,  // +25% luck
                rarity: "rare"
            },
            rod4: { 
                name: "Joran Naga", 
                price: 100000, 
                type: "rod", 
                level: 4, 
                speed: 2.5,
                luck: 50,  // +50% luck
                rarity: "epic"
            },
            rod5: { 
                name: "Joran Legendaris", 
                price: 300000, 
                type: "rod", 
                level: 5, 
                speed: 3.0,
                luck: 100, // +100% luck
                rarity: "mythic"
            },
            rod6: { 
                name: "Joran Dewa", 
                price: 1000000, 
                type: "rod", 
                level: 6, 
                speed: 4.0,
                luck: 200, // +200% luck
                rarity: "secret"
            },
            
            // Umpan - SEKARANG PAKAI LUCK BOOST
            bait1: { 
                name: "Cacing Biasa", 
                price: 500, 
                type: "bait", 
                effect: "luck", 
                bonus: 20,  // +20% luck sementara
                duration: 5 * 60 * 1000,
                rarity: "common"
            },
            bait2: { 
                name: "Udang Kecil", 
                price: 1000, 
                type: "bait", 
                effect: "luck", 
                bonus: 40,  // +40% luck sementara
                duration: 5 * 60 * 1000,
                rarity: "uncommon"
            },
            bait3: { 
                name: "Ikan Kecil", 
                price: 5000, 
                type: "bait", 
                effect: "luck", 
                bonus: 60,  // +60% luck sementara
                duration: 5 * 60 * 1000,
                rarity: "rare"
            },
            bait4: { 
                name: "Kepiting", 
                price: 10000, 
                type: "bait", 
                effect: "luck", 
                bonus: 80,  // +80% luck sementara
                duration: 5 * 60 * 1000,
                rarity: "epic"
            },
            bait5: { 
                name: "Cumi-cumi", 
                price: 50000, 
                type: "bait", 
                effect: "luck", 
                bonus: 100, // +100% luck sementara
                duration: 5 * 60 * 1000,
                rarity: "mythic"
            },
            bait6: { 
                name: "Daging Ajaib", 
                price: 100000, 
                type: "bait", 
                effect: "luck", 
                bonus: 150, // +150% luck sementara
                duration: 5 * 60 * 1000,
                rarity: "secret"
            },
            
            // Booster - TETAP SAMA
            speed1: { 
                name: "Ramuan Kecepatan", 
                price: 1000, 
                type: "booster", 
                effect: "speed", 
                multiplier: 3, 
                duration: 3 * 60 * 1000
            },
            luck1: { 
                name: "Jimat Keberuntungan", 
                price: 5000, 
                type: "booster", 
                effect: "luck", 
                multiplier: 1.5, 
                duration: 7 * 60 * 1000
            },
            gold1: { 
                name: "Doubler Emas", 
                price: 10000, 
                type: "booster", 
                effect: "gold", 
                multiplier: 2, 
                duration: 10 * 60 * 1000
            }
        };
        
        // Fish Data - TANPA CHANCE
        const fishData = {
            river: {
                name: "Sungai Berbatu",
                unlockCost: 0,
                fish: [
                    { name: "Nila", rarity: "common", price: 200, emoji: "🐟" },
                    { name: "Mujair", rarity: "common", price: 200, emoji: "🐠" },
                    { name: "Jamur Air", rarity: "uncommon", price: 300, emoji: "🍄" },
                    { name: "Kodok", rarity: "rare", price: 500, emoji: "🐸" },
                    { name: "Kura-Kura", rarity: "epic", price: 1200, emoji: "🐢" },
                    { name: "Arwana", rarity: "mythic", price: 2000, emoji: "🐉" },
                    { name: "Kecoa", rarity: "junk", price: 50, emoji: "🪳" },
                    { name: "Tai", rarity: "junk", price: 10, emoji: "💩" }
                ]
            },
            swamp: {
                name: "Rawa Berpohon",
                unlockCost: 50000,
                fish: [
                    { name: "Siput", rarity: "common", price: 200, emoji: "🐌" },
                    { name: "Tikus", rarity: "common", price: 200, emoji: "🐁" },
                    { name: "Laba-Laba", rarity: "uncommon", price: 300, emoji: "🕷️" },
                    { name: "Ular Air", rarity: "rare", price: 600, emoji: "🐍" },
                    { name: "Kodok", rarity: "rare", price: 500, emoji: "🐸" },
                    { name: "Rakun", rarity: "epic", price: 800, emoji: "🦡" },
                    { name: "Arwana", rarity: "mythic", price: 2000, emoji: "🐉" },
                    { name: "Buaya", rarity: "mythic", price: 2500, emoji: "🐊" },
                    { name: "Kecoa", rarity: "junk", price: 50, emoji: "🪳" },
                    { name: "Tai", rarity: "junk", price: 10, emoji: "💩" }
                ]
            },
            lake: {
                name: "Danau Pegunungan",
                unlockCost: 100000,
                fish: [
                    { name: "Mujair", rarity: "common", price: 200, emoji: "🐠" },
                    { name: "Nila", rarity: "common", price: 200, emoji: "🐟" },                    
                    { name: "Mas Koki", rarity: "uncommon", price: 400, emoji: "🐡" },
                    { name: "Angsa", rarity: "rare", price: 600, emoji: "🦢" },
                    { name: "Berang-Berang", rarity: "epic", price: 1000, emoji: "🦦" },
                    { name: "Salamander", rarity: "mythic", price: 3000, emoji: "🦎" },
                    { name: "Kraken Danau", rarity: "secret", price: 30000, emoji: "🦑" },
                    { name: "Kecoa", rarity: "junk", price: 50, emoji: "🪳" },
                    { name: "Tai", rarity: "junk", price: 10, emoji: "💩" }
                ]
            },
            volcano: {
                name: "Kawah Gunung Berapi",
                unlockCost: 500000,
                fish: [
                    { name: "Batu", rarity: "common", price: 200, emoji: "🪨" },
                    { name: "Batu Magma", rarity: "uncommon", price: 500, emoji: "🔥" },
                    { name: "Kepiting Lava", rarity: "rare", price: 1000, emoji: "🦀" },
                    { name: "Batu Moai", rarity: "mythic", price: 5000, emoji: "🗿" },
                    { name: "Phoenix", rarity: "secret", price: 30000, emoji: "🐦" }
                ]
            },
            forest: {
                name: "Hutan Rindang",
                unlockCost: 1000000,
                fish: [
                    { name: "Nila", rarity: "common", price: 200, emoji: "🐟" },
                    { name: "Mujair", rarity: "common", price: 200, emoji: "🐠" },                    
                    { name: "Serangga Air", rarity: "uncommon", price: 500, emoji: "🪲" },
                    { name: "Tikus Hutan", rarity: "rare", price: 600, emoji: "🐀" },
                    { name: "Ular Air", rarity: "rare", price: 600, emoji: "🐍" },                    
                    { name: "Kura-Kura", rarity: "epic", price: 1200, emoji: "🐢" },
                    { name: "Buaya", rarity: "mythic", price: 2500, emoji: "🐊" },                    
                    { name: "Loch Ness", rarity: "secret", price: 30000, emoji: "🦕" },
                    { name: "Unicorn", rarity: "secret", price: 50000, emoji: "🦄" },
                    { name: "Kecoa", rarity: "junk", price: 50, emoji: "🪳" }
                ]
            },
            ocean: {
                name: "Laut Berpantai",
                unlockCost: 5000000,
                fish: [
                    { name: "Kerang", rarity: "common", price: 200, emoji: "🐚" },
                    { name: "Ubur-Ubur", rarity: "common", price: 200, emoji: "🪼" },
                    { name: "Udang", rarity: "uncommon", price: 600, emoji: "🦐" },
                    { name: "Lobster", rarity: "rare", price: 1000, emoji: "🦞" },
                    { name: "Gurita", rarity: "rare", price: 1000, emoji: "🐙" },
                    { name: "Anjing Laut", rarity: "epic", price: 2000, emoji: "🦭" },
                    { name: "Paus", rarity: "mythic", price: 5000, emoji: "🐳" },
                    { name: "Putri Duyung", rarity: "secret", price: 30000, emoji: "🧜‍♀️" },
                    { name: "Megalodon", rarity: "secret", price: 50000, emoji: "🦈" }
                ]
            }
        };
        
        // DOM Elements
        const goldElement = document.getElementById('gold');
        const rodLevelElement = document.getElementById('rodLevel');
        const totalFishElement = document.getElementById('totalFish');
        const fishingSpeedElement = document.getElementById('fishingSpeed');
        const resultElement = document.getElementById('result');
        const progressBarElement = document.getElementById('progressBar');
        const castButton = document.getElementById('castButton');
        const autoFishBtn = document.getElementById('autoFishBtn');
        const fishermanElement = document.getElementById('fisherman');
        const inventoryItemsElement = document.getElementById('inventoryItems');
        const activeBoostersElement = document.getElementById('activeBoosters');
        const shopModal = document.getElementById('shopModal');
        const fishListModal = document.getElementById('fishListModal');
        const fishListLocationNameElement = document.getElementById('fishListLocationName');
        const fishListElement = document.getElementById('fishList');
        
        // Initialize Game
        function initGame() {
            updateUI();
            updateLocationButtons();
            updateInventoryDisplay();
            updateActiveBoosters();
            updateShopDisplay();
        }
        
        // Update UI - TAMBAHKAN LUCK STAT
        function updateUI() {
            goldElement.textContent = gold.toLocaleString();
            rodLevelElement.textContent = shopItems[currentRod].name;
            totalFishElement.textContent = totalFishCaught.toLocaleString();
            fishingSpeedElement.textContent = fishingSpeed.toFixed(1) + 'x';
            
            // Hitung dan tampilkan total luck
            let totalLuck = shopItems[currentRod].luck || 0;
            
            // Tambah luck dari umpan aktif
            if (activeBaits.luck) {
                totalLuck += activeBaits.luck.bonus;
            }
            
            // Apply luck booster multiplier
            if (activeBoosters.luck) {
                totalLuck *= activeBoosters.luck.multiplier;
            }
            
            // Update luck stat display
            document.getElementById('totalLuck').textContent = Math.round(totalLuck) + '%';
            
            // Update background
            document.querySelectorAll('.location-background').forEach(bg => {
                bg.classList.remove('active-bg');
            });
            document.getElementById(currentLocation + 'Bg').classList.add('active-bg');
        }
        
        // Urutan lokasi yang baru: Sungai -> Rawa -> Danau -> Kawah -> Hutan -> Laut
        const locationOrder = ['river', 'swamp', 'lake', 'volcano', 'forest', 'ocean'];

        // Update Location Buttons
        function updateLocationButtons() {
            const locationEmojis = {
                river: '💧',
                swamp: '🪷', 
                lake: '🛶',
                volcano: '🌋',
                forest: '🌲',
                ocean: '🌊'
            };
            
            const locationNames = {
                river: 'Sungai',
                swamp: 'Rawa',
                lake: 'Danau', 
                volcano: 'Kawah',
                forest: 'Hutan',
                ocean: 'Laut'
            };
            
            locationOrder.forEach(location => {
                const btn = document.getElementById('btn' + location.charAt(0).toUpperCase() + location.slice(1));
                
                if (unlockedLocations.includes(location)) {
                    // LOKASI TERBUKA
                    btn.classList.remove('locked');
                    btn.onclick = function() { changeLocation(location); };
                    
                    if (currentLocation === location) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                    
                    btn.innerHTML = `${locationEmojis[location]} ${locationNames[location]}`;
                } else {
                    // LOKASI TERKUNCI - PERBAIKAN: gembok di kiri, koin di harga
                    btn.classList.add('locked');
                    btn.classList.remove('active');
                    btn.onclick = function() { unlockLocation(location); };
                    btn.innerHTML = `🔒 ${locationEmojis[location]} ${locationNames[location]} ${fishData[location].unlockCost.toLocaleString()} 🪙`;
                }
            });
        }
        
        // Change Location
        function changeLocation(location) {
            if (unlockedLocations.includes(location)) {
                fishermanElement.classList.add('walking');
                
                setTimeout(() => {
                    currentLocation = location;
                    updateUI();
                    updateLocationButtons();
                    
                    resultElement.textContent = `Pindah ke ${fishData[location].name}!`;
                    
                    fishermanElement.classList.remove('walking');
                }, 500);
            }
        }
        
        // Unlock Location
        function unlockLocation(location) {
            const cost = fishData[location].unlockCost;
            
            if (gold >= cost) {
                gold -= cost;
                unlockedLocations.push(location);
                updateUI();
                updateLocationButtons();
                
                resultElement.textContent = `Berhasil membuka ${fishData[location].name}!`;
                changeLocation(location);
            } else {
                resultElement.textContent = `Gold tidak cukup! Butuh ${cost.toLocaleString()} gold.`;
            }
        }
        
        // Start Fishing
        function startFishing() {
            if (isFishing) return;
            
            isFishing = true;
            castButton.disabled = true;
            fishermanElement.classList.add('fishing');
            
            // Calculate fishing time based on rod speed and boosters
            let baseTime = 3000; // 3 seconds base
            let speedMultiplier = fishingSpeed;
            
            // Apply speed booster if active
            if (activeBoosters.speed) {
                speedMultiplier *= activeBoosters.speed.multiplier;
            }
            
            const fishingTime = baseTime / speedMultiplier;
            let progress = 0;
            
            // Progress bar animation
            const progressInterval = setInterval(() => {
                progress += 10;
                progressBarElement.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    finishFishing();
                }
            }, fishingTime / 10);
        }
        
        // Finish Fishing
        function finishFishing() {
            isFishing = false;
            castButton.disabled = false;
            fishermanElement.classList.remove('fishing');
            progressBarElement.style.width = '0%';
            
            // Catch a fish
            const fish = catchFish();
            
            // Add to inventory
            if (!inventory[fish.name]) {
                inventory[fish.name] = { ...fish, count: 1 };
            } else {
                inventory[fish.name].count++;
            }
            
            totalFishCaught++;
            
            // Display result with animation
            displayFishCaught(fish);
            
            // Update UI
            updateUI();
            updateInventoryDisplay();
            
            // Continue auto fishing if enabled
            if (isAutoFishing) {
                setTimeout(startFishing, 500);
            }
        }
        
        // Catch Fish Logic - VERSI DENGAN PROBABILITAS YANG DIMINTA
        function catchFish() {
            const locationFish = fishData[currentLocation].fish;
            
            // Hitung total luck dari semua sumber
            let totalLuck = shopItems[currentRod].luck || 0;
            
            // Tambah luck dari umpan aktif
            if (activeBaits.luck) {
                totalLuck += activeBaits.luck.bonus;
            }
            
            // Apply luck booster multiplier
            if (activeBoosters.luck) {
                totalLuck *= activeBoosters.luck.multiplier;
            }
            
            // PROBABILITAS BASE SESUAI PERMINTAAN (dalam %)
            const baseChances = {
                'secret': 0.0002,    // 1 dari 500,000 = 0.0002%
                'mythic': 0.001,     // 1 dari 100,000 = 0.001%
                'epic': 0.002,       // 1 dari 50,000 = 0.002%
                'rare': 0.02,        // 1 dari 5,000 = 0.02%
                'uncommon': 15,      // 15%
                'common': 70,        // 70%
                'junk': 14.9768      // Sisa sampai 100%
            };
            
            // HARD CAPS - MAKSIMAL DENGAN LUCK TINGGI
            const maxChances = {
                'secret': 0.005,
                'mythic': 0.01,
                'epic': 1,
                'rare': 5,
                'uncommon': 30,
                'common': 50,
                'junk': 10
            };
            
            // Luck effect - semakin tinggi luck, semakin turun common & junk
            const luckEffect = Math.min(totalLuck / 100, 5); // Maksimal 5x dengan luck 500%
            
            // Adjusted chances: Luck TINGGI = Common & Junk TURUN, Rare+ NAIK
            const adjustedChances = {
                'common': Math.max(50, baseChances.common - (luckEffect * 4)),
                'uncommon': Math.min(maxChances.uncommon, baseChances.uncommon + (luckEffect * 1)),
                'rare': Math.min(maxChances.rare, baseChances.rare + (luckEffect * 0.016)),
                'epic': Math.min(maxChances.epic, baseChances.epic + (luckEffect * 0.0016)),
                'mythic': Math.min(maxChances.mythic, baseChances.mythic + (luckEffect * 0.0008)),
                'secret': Math.min(maxChances.secret, baseChances.secret + (luckEffect * 0.00016)),
                'junk': Math.max(2, baseChances.junk - (luckEffect * 2))
            };
            
            // Normalize probabilities
            let totalChance = Object.values(adjustedChances).reduce((a, b) => a + b, 0);
            
            // Pilih rarity berdasarkan adjusted chances
            const randRarity = Math.random() * totalChance;
            let cumulative = 0;
            let selectedRarity = 'common';
            
            for (const [rarity, chance] of Object.entries(adjustedChances)) {
                cumulative += chance;
                if (randRarity <= cumulative) {
                    selectedRarity = rarity;
                    break;
                }
            }
            
            // Dapatkan semua ikan dengan rarity yang terpilih
            const availableFish = locationFish.filter(fish => fish.rarity === selectedRarity);
            
            // Jika ada ikan dengan rarity tersebut, pilih random satu
            if (availableFish.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableFish.length);
                return availableFish[randomIndex];
            }
            
            // Fallback: pilih ikan common pertama
            return locationFish.find(fish => fish.rarity === 'common') || locationFish[0];
        }
        
        // Display Fish Caught with Animation
        function displayFishCaught(fish) {
            const fishEmoji = document.createElement('div');
            fishEmoji.className = 'fish-caught';
            fishEmoji.textContent = fish.emoji;
            fishEmoji.style.left = '120px';
            
            document.querySelector('.game-world').appendChild(fishEmoji);
            
            // Remove after animation
            setTimeout(() => {
                fishEmoji.remove();
            }, 1500);
            
            // Update result text dengan warna rarity
            let rarityColor = '';
            
            switch(fish.rarity) {
                case 'common': 
                    rarityColor = '#FFFFFF';
                    break;
                case 'uncommon': 
                    rarityColor = '#4ECDC4';
                    break;
                case 'rare': 
                    rarityColor = '#FFD700';
                    break;
                case 'epic': 
                    rarityColor = '#FF6B6B';
                    break;
                case 'mythic': 
                    rarityColor = '#FF00FF';
                    break;
                case 'secret': 
                    rarityColor = '#00FFFF';
                    break;
                case 'junk': 
                    rarityColor = '#8B4513';
                    break;
            }
            
            resultElement.innerHTML = `Anda menangkap <strong style="color: ${rarityColor}">${fish.name} ${fish.emoji}</strong>`;
        }

        // Toggle Auto Fishing
        function toggleAutoFishing() {
            isAutoFishing = !isAutoFishing;
            
            if (isAutoFishing) {
                autoFishBtn.classList.add('active');
                fishermanElement.classList.add('auto-fishing');
                resultElement.textContent = "Auto Mancing diaktifkan!";
                if (!isFishing) {
                    startFishing();
                }
            } else {
                autoFishBtn.classList.remove('active');
                fishermanElement.classList.remove('auto-fishing');
                resultElement.textContent = "Auto Mancing dimatikan.";
            }
        }
        
        // Sell All Fish
        function sellAllFish() {
            if (isFishing) return;
            
            let totalValue = 0;
            let fishCount = 0;
            
            for (const fishName in inventory) {
                const fish = inventory[fishName];
                // Skip locked fish
                if (lockedFish[fishName]) continue;
                
                totalValue += fish.price * fish.count;
                fishCount += fish.count;
                delete inventory[fishName];
            }
            
            if (fishCount === 0) {
                resultElement.textContent = "Tidak ada ikan untuk dijual!";
                return;
            }
            
            // Apply luck booster
            if (activeBoosters.luck) {
                totalValue = Math.floor(totalValue * activeBoosters.luck.multiplier);
            }
            
            gold += totalValue;
            
            updateUI();
            updateInventoryDisplay();
            
            resultElement.textContent = `Anda menjual ${fishCount} ikan seharga ${totalValue.toLocaleString()} emas!`;
        }
        
        // Toggle Fish Lock
        function toggleFishLock(fishName) {
            if (lockedFish[fishName]) {
                delete lockedFish[fishName];
            } else {
                lockedFish[fishName] = true;
            }
            updateInventoryDisplay();
        }
        
        // Update Inventory Display
        function updateInventoryDisplay() {
            const fishCount = Object.keys(inventory).length;
            
            if (fishCount === 0) {
                inventoryItemsElement.innerHTML = '<div style="text-align: center; width: 100%; opacity: 0.7;">Belum ada ikan yang ditangkap!</div>';
                return;
            }
            
            let inventoryHTML = '';
            
            // Urutkan ikan berdasarkan rarity (langka -> umum)
            const sortedFish = Object.keys(inventory).map(fishName => inventory[fishName]).sort((a, b) => {
                const rarityOrder = {
                    'secret': 0,
                    'mythic': 1,
                    'epic': 2,
                    'rare': 3,
                    'uncommon': 4,
                    'common': 5,
                    'junk': 6
                };
                
                return rarityOrder[a.rarity] - rarityOrder[b.rarity];
            });
            
            // Tampilkan ikan yang sudah diurutkan
            for (const fish of sortedFish) {
                const isLocked = lockedFish[fish.name];
                let rarityClass = '';
                
                switch(fish.rarity) {
                    case 'common': rarityClass = 'rarity-common'; break;
                    case 'uncommon': rarityClass = 'rarity-uncommon'; break;
                    case 'rare': rarityClass = 'rarity-rare'; break;
                    case 'epic': rarityClass = 'rarity-epic'; break;
                    case 'mythic': rarityClass = 'rarity-mythic'; break;
                    case 'secret': rarityClass = 'rarity-secret'; break;
                    case 'junk': rarityClass = 'rarity-junk'; break;
                }
                
                inventoryHTML += `
                    <div class="inventory-item ${isLocked ? 'locked' : ''}">
                        <button class="lock-btn" onclick="toggleFishLock('${fish.name}')">
                            ${isLocked ? '🔒' : '🔓'}
                        </button>
                        <div style="font-size: 1.5rem;">${fish.emoji}</div>
                        <div>${fish.name}</div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">${fish.count}x</div>
                        <div style="color: #ffd700; font-weight: bold;">${fish.price.toLocaleString()} 🪙</div>
                        <div class="item-rarity ${rarityClass}" style="margin-top: 5px;">${fish.rarity.toUpperCase()}</div>
                    </div>
                `;
            }
            
            inventoryItemsElement.innerHTML = inventoryHTML;
        }
        
        // Update Active Boosters
        function updateActiveBoosters() {
            let boostersHTML = '';
            
            // Check for expired boosters
            const now = Date.now();
            for (const type in activeBoosters) {
                if (activeBoosters[type].expires < now) {
                    delete activeBoosters[type];
                }
            }
            
            for (const type in activeBaits) {
                if (activeBaits[type].expires < now) {
                    delete activeBaits[type];
                }
            }
            
            // Display active boosters
            for (const type in activeBoosters) {
                const booster = activeBoosters[type];
                const timeLeft = Math.ceil((booster.expires - now) / 1000 / 60);
                boostersHTML += `<div class="booster-item">${booster.name} (${timeLeft}m)</div>`;
            }
            
            // Display active baits
            for (const type in activeBaits) {
                const bait = activeBaits[type];
                const timeLeft = Math.ceil((bait.expires - now) / 1000 / 60);
                boostersHTML += `<div class="booster-item">${bait.name} (+${bait.bonus}% Luck, ${timeLeft}m)</div>`;
            }
            
            activeBoostersElement.innerHTML = boostersHTML;
            
            // Update UI untuk refresh luck stat
            updateUI();
            
            // Update every minute
            setTimeout(updateActiveBoosters, 60000);
        }
        
        // Open Shop
        function openShop() {
            shopModal.classList.add('active');
            updateShopDisplay(); // TAMBAHKAN BARIS INI
        }

        // Close Shop
        function closeShop() {
            shopModal.classList.remove('active');
        }
        
        // Update Shop Display
        function updateShopDisplay() {
            // Pastikan elemen shop sudah tersedia
            const shopItems = document.querySelectorAll('.shop-item');
            
            if (shopItems.length === 0) {
                return; // Keluar jika elemen belum tersedia
            }
            
            shopItems.forEach(shopItem => {
                const onclickAttr = shopItem.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('rod')) {
                    // Extract rod ID dari onclick
                    const rodMatch = onclickAttr.match(/buyItem\('(rod\d+)'\)/);
                    if (!rodMatch) return;
                    
                    const rodId = rodMatch[1];
                    
                    // Reset class
                    shopItem.classList.remove('owned', 'current-rod');
                    
                    // Cek jika sudah dimiliki
                    if (ownedRods.includes(rodId)) {
                        shopItem.classList.add('owned');
                        
                        // Nonaktifkan klik
                        shopItem.onclick = null;
                        shopItem.style.cursor = 'not-allowed';
                        
                        // Tambah badge "Sudah Punya" jika belum ada
                        let priceElement = shopItem.querySelector('.item-price');
                        if (priceElement && !shopItem.querySelector('.owned-badge')) {
                            const ownedBadge = document.createElement('span');
                            ownedBadge.className = 'owned-badge';
                            ownedBadge.textContent = '✓ Sudah Punya';
                            priceElement.parentNode.insertBefore(ownedBadge, priceElement);
                        }
                        
                        // Hapus harga jika sudah dimiliki
                        if (priceElement) {
                            priceElement.style.display = 'none';
                        }
                    }
                    
                    // Cek jika sedang digunakan
                    if (currentRod === rodId) {
                        shopItem.classList.add('current-rod');
                        
                        // Tambah badge "Sedang Dipakai" jika belum ada
                        let priceElement = shopItem.querySelector('.item-price');
                        if (priceElement && !shopItem.querySelector('.current-badge')) {
                            const currentBadge = document.createElement('span');
                            currentBadge.className = 'current-badge';
                            currentBadge.textContent = '🎣 Sedang Dipakai';
                            priceElement.parentNode.insertBefore(currentBadge, priceElement);
                        }
                    }
                }
            });
        }

        // Open Fish List
        function openFishList() {
            fishListLocationNameElement.textContent = fishData[currentLocation].name;
            updateFishList();
            fishListModal.classList.add('active');
        }
        
        // Close Fish List
        function closeFishList() {
            fishListModal.classList.remove('active');
        }
        
        // Update Fish List
        function updateFishList() {
            const locationFish = fishData[currentLocation].fish;
            let fishListHTML = '';
            
            for (const fish of locationFish) {
                let rarityClass = '';
                switch(fish.rarity) {
                    case 'common': rarityClass = 'rarity-common'; break;
                    case 'uncommon': rarityClass = 'rarity-uncommon'; break;
                    case 'rare': rarityClass = 'rarity-rare'; break;
                    case 'epic': rarityClass = 'rarity-epic'; break;
                    case 'mythic': rarityClass = 'rarity-mythic'; break;
                    case 'secret': rarityClass = 'rarity-secret'; break;
                    case 'junk': rarityClass = 'rarity-junk'; break;
                }
                
                fishListHTML += `
                    <div class="fish-item">
                        <div class="fish-emoji">${fish.emoji}</div>
                        <div><strong>${fish.name}</strong></div>
                        <div style="color: #ffd700; font-weight: bold;">${fish.price.toLocaleString()} 🪙</div>
                        <div class="fish-rarity ${rarityClass}">${fish.rarity.toUpperCase()}</div>
                    </div>
                `;
            }
            
            fishListElement.innerHTML = fishListHTML;
        }
        
        // Buy Item
        function buyItem(itemId) {
            const item = shopItems[itemId];
            
            if (!item) {
                resultElement.textContent = "Item tidak ditemukan!";
                return;
            }
            
            if (gold < item.price) {
                resultElement.textContent = `Tidak cukup emas! Butuh ${item.price.toLocaleString()} emas.`;
                return;
            }
            
            // Process purchase
            gold -= item.price;
            
            if (item.type === 'rod') {
                // Cek apakah sudah punya rod ini
                if (!ownedRods.includes(itemId)) {
                    ownedRods.push(itemId);
                }
                
                currentRod = itemId;
                fishingSpeed = item.speed;
                resultElement.textContent = `Anda ${ownedRods.includes(itemId) ? 'menggunakan' : 'membeli'} ${item.name}! Kecepatan memancing: ${fishingSpeed}x`;
                
                // Update tampilan toko
                updateShopDisplay();
            }
            else if (item.type === 'bait') {
                // Activate bait
                activeBaits[item.effect] = {
                    name: item.name,
                    bonus: item.bonus,
                    expires: Date.now() + item.duration
                };
                resultElement.textContent = `Anda menggunakan ${item.name}! +${item.bonus}% ${item.effect} ikan selama 5 menit.`;
            }
            else if (item.type === 'booster') {
                // Activate booster
                activeBoosters[item.effect] = {
                    name: item.name,
                    multiplier: item.multiplier,
                    expires: Date.now() + item.duration
                };
                resultElement.textContent = `Anda menggunakan ${item.name}! Efek aktif selama ${item.duration / 60000} menit.`;
            }
            
            updateUI();
            updateActiveBoosters();
            closeShop();
        }
        
        // Get Next Locked Location
        function getNextLockedLocation() {
            const locationsOrder = ['swamp', 'lake', 'volcano', 'forest', 'ocean'];
            for (const location of locationsOrder) {
                if (!unlockedLocations.includes(location)) {
                    return location;
                }
            }
            return null;
        }
        
        // Initialize the game when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initGame();
        });

        function openAdminModal() {
            const password = prompt("Masukkan kode admin:");
            if (password === "admin123") {
                document.getElementById('adminModal').classList.add('active');
            } else if (password) {
                alert("Kode admin salah!");
            }
        }

        function showAdminMessage(message) {
            resultElement.textContent = message;
        }

        
        function closeAdminModal() {
            document.getElementById('adminModal').classList.remove('active');
        }

        function unlockAllLocations() {
            const allLocations = ['river', 'swamp', 'volcano', 'ocean', 'lake', 'forest'];
            unlockedLocations = [...new Set([...unlockedLocations, ...allLocations])];
            updateLocationButtons();
            showAdminMessage("🗺️ Semua lokasi terbuka!");
        }

        function maxAllRods() {
            ownedRods = ['rod1', 'rod2', 'rod3', 'rod4', 'rod5', 'rod6'];
            currentRod = 'rod6';
            fishingSpeed = shopItems[currentRod].speed;
            updateUI();
            updateShopDisplay(); // TAMBAHKAN BARIS INI
            showAdminMessage("🎣 Semua pancingan diupgrade maksimal!");
        }


        function addCustomGold() {
            const input = document.getElementById('customGold');
            const amount = parseInt(input.value);
            
            if (amount && amount > 0) {
                gold += amount;
                updateUI();
                showAdminMessage(`+${amount.toLocaleString()} Gold ditambahkan!`);
                input.value = '';
            } else {
                alert("Masukkan jumlah gold yang valid!");
            }
        }

        // Fish Selector Functions
        let selectedFish = null;

        function openFishSelector() {
            document.getElementById('fishSelectorModal').classList.add('active');
            updateFishSelection();
        }

        function closeFishSelector() {
            document.getElementById('fishSelectorModal').classList.remove('active');
            selectedFish = null;
        }

        function updateFishSelection() {
            const location = document.getElementById('locationSelect').value;
            const grid = document.getElementById('fishSelectionGrid');
            
            let allFish = [];
            
            if (location === 'all') {
                // Ambil semua ikan dari semua lokasi
                for (const loc in fishData) {
                    allFish = allFish.concat(fishData[loc].fish.map(fish => ({
                        ...fish,
                        location: loc
                    })));
                }
            } else {
                // Ambil ikan dari lokasi tertentu
                allFish = fishData[location].fish.map(fish => ({
                    ...fish,
                    location: location
                }));
            }
            
            // Hapus duplikat berdasarkan nama
            const uniqueFish = [];
            const seen = new Set();
            
            for (const fish of allFish) {
                if (!seen.has(fish.name)) {
                    seen.add(fish.name);
                    uniqueFish.push(fish);
                }
            }
            
            // Tampilkan ikan
            grid.innerHTML = '';
            uniqueFish.forEach(fish => {
                const rarityClass = `rarity-${fish.rarity}`;
                const isSelected = selectedFish && selectedFish.name === fish.name;
                
                const fishElement = document.createElement('div');
                fishElement.className = `fish-selection-item ${isSelected ? 'selected' : ''}`;
                fishElement.onclick = () => selectFish(fish);
                
                fishElement.innerHTML = `
                    <div class="fish-selector-emoji">${fish.emoji}</div>
                    <div class="fish-selector-name">${fish.name}</div>
                    <div class="fish-selector-price">${fish.price.toLocaleString()} 🪙</div>
                    <div class="fish-selector-rarity ${rarityClass}">${fish.rarity.toUpperCase()}</div>
                    <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 3px;">${fishData[fish.location].name}</div>
                `;
                
                grid.appendChild(fishElement);
            });
        }

        function selectFish(fish) {
            selectedFish = fish;
            updateFishSelection(); // Refresh tampilan untuk update selected state
        }

        function addSelectedFish() {
            if (!selectedFish) {
                alert("Pilih ikan terlebih dahulu!");
                return;
            }
            
            const quantityInput = document.getElementById('fishQuantity');
            const quantity = parseInt(quantityInput.value) || 1;
            
            if (quantity < 1 || quantity > 999) {
                alert("Jumlah ikan harus antara 1-999!");
                return;
            }
            
            // Tambahkan ke inventory
            if (!inventory[selectedFish.name]) {
                inventory[selectedFish.name] = {
                    ...selectedFish,
                    count: quantity
                };
            } else {
                inventory[selectedFish.name].count += quantity;
            }
            
            updateInventoryDisplay();
            closeFishSelector();
            
            showAdminMessage(`✅ ${quantity} ${selectedFish.name} ${selectedFish.emoji} ditambahkan ke inventory!`);
            
            // Reset selection
            selectedFish = null;
            quantityInput.value = 1;
        }
        
        // Save System
        const SAVE_KEY = 'mancing_mania_save';

        // Save Game Data
        function saveGame() {
            const saveData = {
                gold: gold,
                currentRod: currentRod,
                fishingSpeed: fishingSpeed,
                totalFishCaught: totalFishCaught,
                currentLocation: currentLocation,
                unlockedLocations: unlockedLocations,
                inventory: inventory,
                activeBoosters: activeBoosters,
                activeBaits: activeBaits,
                lockedFish: lockedFish,
                ownedRods: ownedRods,
                timestamp: Date.now()
            };
            
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            console.log('Game saved!');
        }

        // Load Game Data
        function loadGame() {
            const saved = localStorage.getItem(SAVE_KEY);
            
            if (saved) {
                try {
                    const saveData = JSON.parse(saved);
                    
                    gold = saveData.gold || 500;
                    currentRod = saveData.currentRod || 'rod1';
                    fishingSpeed = saveData.fishingSpeed || 1;
                    totalFishCaught = saveData.totalFishCaught || 0;
                    currentLocation = saveData.currentLocation || 'river';
                    unlockedLocations = saveData.unlockedLocations || ['river'];
                    inventory = saveData.inventory || {};
                    activeBoosters = saveData.activeBoosters || {};
                    activeBaits = saveData.activeBaits || {};
                    lockedFish = saveData.lockedFish || {};
                    ownedRods = saveData.ownedRods || ['rod1'];
                    
                    console.log('Game loaded!');
                    return true;
                } catch (error) {
                    console.error('Error loading save:', error);
                    return false;
                }
            }
            return false;
        }

        // Delete Save Data
        function deleteSave() {
            localStorage.removeItem(SAVE_KEY);
            console.log('Save data deleted!');
        }

        // Auto-save setiap 30 detik
        function startAutoSave() {
            setInterval(() => {
                if (!isFishing) { // Jangan save saat sedang memancing
                    saveGame();
                }
            }, 30000); // 30 detik
        }

        // Manual save
        function manualSave() {
            saveGame();
            showSaveMessage('💾 Game berhasil disimpan!');
        }

        // Manual load
        function manualLoad() {
            if (loadGame()) {
                updateUI();
                updateLocationButtons();
                updateInventoryDisplay();
                updateActiveBoosters();
                updateShopDisplay();
                showSaveMessage('📂 Game berhasil dimuat!');
            } else {
                showSaveMessage('❌ Tidak ada data save yang ditemukan!');
            }
        }

        // Show save message
        function showSaveMessage(message) {
            // Buat elemen notifikasi sementara
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px 30px;
                border-radius: 15px;
                border: 3px solid #ffd700;
                font-size: 1.2rem;
                z-index: 3000;
                animation: fadeInOut 2s ease-in-out;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }

        // CSS animation untuk notifikasi
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -60%); }
                20% { opacity: 1; transform: translate(-50%, -50%); }
                80% { opacity: 1; transform: translate(-50%, -50%); }
                100% { opacity: 0; transform: translate(-50%, -40%); }
            }
        `;
        document.head.appendChild(style);

        function updateVersionDisplay() {
            const versionElement = document.getElementById('gameVersion');
            if (versionElement) {
                versionElement.textContent = GAME_VERSION;
            }
        }

        // Update initGame function untuk include save system
        function initGame() {
                ensureVersionCompatibility();
                updateVersionDisplay(); 
            
            if (!loadGame()) {
                // Jika tidak ada save, mulai dengan data default
                console.log('No save data found, starting new game');
            }
            
            updateUI();
            updateLocationButtons();
            updateInventoryDisplay();
            updateActiveBoosters();
            updateShopDisplay();
            updateSaveStatus();
            startAutoSave();
            
            // Tampilkan info save status
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const saveData = JSON.parse(saved);
                const saveTime = new Date(saveData.timestamp).toLocaleTimeString();
                console.log(`Last save: ${saveTime}`);
            }
        }

        // Tambahkan fungsi export/import save data
        function exportSave() {
            const saveData = localStorage.getItem(SAVE_KEY);
            if (saveData) {
                // Buat blob untuk download
                const blob = new Blob([saveData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mancing_mania_save.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showSaveMessage('📤 Save data berhasil diexport!');
            } else {
                showSaveMessage('❌ Tidak ada data save untuk diexport!');
            }
        }

        function importSave() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const saveData = JSON.parse(e.target.result);
                            // Validasi basic save data
                            if (saveData.gold !== undefined && saveData.inventory !== undefined) {
                                localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
                                manualLoad();
                                showSaveMessage('📥 Save data berhasil diimport!');
                            } else {
                                showSaveMessage('❌ File save tidak valid!');
                            }
                        } catch (error) {
                            showSaveMessage('❌ Error membaca file save!');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            
            input.click();
        }

        // Settings Modal Functions
        function openSettings() {
            document.getElementById('settingsModal').classList.add('active');
        }

        function closeSettings() {
            document.getElementById('settingsModal').classList.remove('active');
        }

        // Reset Game Data
        function resetGameData() {
            if (confirm('⚠️ APAKAH ANDA YAKIN?\n\nSemua progres akan dihapus dan game akan dimulai dari awal!\n\nTindakan ini tidak dapat dibatalkan!')) {
                deleteSave();
                
                // Reset semua variabel ke default
                gold = 500;
                currentRod = 'rod1';
                fishingSpeed = 1;
                totalFishCaught = 0;
                currentLocation = 'river';
                unlockedLocations = ['river'];
                isFishing = false;
                isAutoFishing = false;
                inventory = {};
                activeBoosters = {};
                activeBaits = {};
                lockedFish = {};
                ownedRods = ['rod1'];
                
                // Update UI
                updateUI();
                updateLocationButtons();
                updateInventoryDisplay();
                updateActiveBoosters();
                updateShopDisplay();
                
                closeSettings();
                showSaveMessage('🔄 Game telah direset! Mulai dari awal...');
            }
        }

        // Update save status
        function updateSaveStatus() {
            const saved = localStorage.getItem(SAVE_KEY);
            const statusElement = document.getElementById('saveStatus');
            
            if (saved) {
                const saveData = JSON.parse(saved);
                const saveTime = new Date(saveData.timestamp).toLocaleTimeString();
                statusElement.innerHTML = `💾 Terakhir disimpan: ${saveTime}`;
            } else {
                statusElement.innerHTML = '💾 Belum ada save data';
            }
        }

        // Panggil updateSaveStatus secara berkala
        setInterval(updateSaveStatus, 10000);

        // Emergency backup system
        function createEmergencyBackup() {
            const saveData = localStorage.getItem('mancing_mania_save');
            if (saveData) {
                // Create multiple backups
                localStorage.setItem('backup_v1_' + Date.now(), saveData);
                console.log('Emergency backup created');
            }
        }

        // Panggil sebelum deploy
        createEmergencyBackup();
        
        // Manual update check function - bisa dipanggil setelah deploy
        function checkForUpdates() {
            if (window.updateManager) {
                window.updateManager.checkForUpdates();
            }
        }

        // Keyboard shortcut untuk buka admin panel (Ctrl+Shift+A)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                openAdminModal();
            }

        });


