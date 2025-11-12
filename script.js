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
        let currentBait = null;
        let ownedBaits = [];

        // ======== SISTEM LEVEL PLAYER ======== //
        let playerLevel = 1;
        let playerExp = 0;
        let playerExpCap = 50; // Level 1 -> 2
        const maxLevel = 500;
        let permanentLuckBonus = 0; // dari level-up

        // ==================== VERSION MANAGEMENT ====================
        const GAME_VERSION = '1.0';

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

        // ==================== FITUR BARU: INFO UPDATE (Statis, hanya developer ubah di kode) ==================== //
        document.addEventListener("DOMContentLoaded", () => {
            const header = document.querySelector(".game-header");
            if (header) {
                const infoButton = document.createElement("button");
                infoButton.className = "info-update-btn";
                infoButton.textContent = "ℹ️ Info Update";
                header.appendChild(infoButton);

                infoButton.addEventListener("click", openInfoUpdateModal);
            }
        });

        // 📰 ISI INFO UPDATE — kamu tulis manual di sini (ubah sesuai kebutuhan)
        const INFO_UPDATE_TEXT = `
            <h3>Info Update Hari Ini</h3>
            <ul style="text-align:left;">
                <li>Sudah Bukan Demo Mantul</li>
                <li>Pancingan Di Layar Sesuai Yang Dipakai</li>
                <li>Progress Level (1 Level = 2% 🍀)</li>
                <li>Umpan Jadi Barang Permanen</li>
                <li>Booster Dirombak (Gabisa Stack)</li>
                <li>Lokasi Baru Atlantis</li>
                <li>Rarity Baru Divine</li>
                <li>Barang Baru Di Toko</li>
                <li>Fitur Baru Catatan Ikan Ganti Daftar Ikan</li>
            </ul>
            <p style="text-align:center; opacity:0.8; margin-top:10px;">
                ELB
            </p>
        `;

        function openInfoUpdateModal() {
            const modal = document.createElement("div");
            modal.className = "info-update-modal";
            modal.innerHTML = `
                <div class="info-update-content">
                    <h2>📢 Informasi Update</h2>
                    <div class="update-text">${INFO_UPDATE_TEXT}</div>
                    <button class="close-info-btn">Tutup</button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector(".close-info-btn").addEventListener("click", () => modal.remove());
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
        
        // ==================== FITUR UPDATE LOG ==================== //
        function openUpdateLog() {
            const modal = document.createElement("div");
            modal.className = "update-log-modal";
            modal.innerHTML = `
                <div class="update-log-content">
                    <h2>📜 Catatan Pembaruan</h2>
                    <div id="updateLogList">
                        <p style="text-align:center; opacity:0.7;">(Tulis daftar update di sini)</p>
                    </div>
                    <button id="closeUpdateLog">Tutup</button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById("closeUpdateLog").addEventListener("click", () => modal.remove());
        }

        // Pasang event klik ke seluruh kotak stat-item yang berisi "Update Log"
        document.addEventListener("DOMContentLoaded", () => {
            const updateLogItem = Array.from(document.querySelectorAll(".stat-item"))
                .find(el => el.textContent.trim().includes("Update Log"));

            if (updateLogItem) {
                updateLogItem.addEventListener("click", openUpdateLog);
                updateLogItem.classList.add("update-log-item-clickable");
            }
        });

        // Equipment and Boosters Data - VERSI BARU
        const shopItems = {
            // Pancingan - SEKARANG PAKAI LUCK
            rod1: { 
                name: "Pancingan Bambu", 
                price: 0, 
                type: "rod", 
                level: 1, 
                speed: 1.0,
                luck: 0,  // +0% luck
                rarity: "common"
            },
            rod2: { 
                name: "Pancingan Kayu", 
                price: 20000, 
                type: "rod", 
                level: 2, 
                speed: 1.5,
                luck: 10,  // +10% luck
                rarity: "uncommon"
            },
            rod3: { 
                name: "Pancingan Besi", 
                price: 50000, 
                type: "rod", 
                level: 3, 
                speed: 2.0,
                luck: 25,  // +25% luck
                rarity: "rare"
            },
            rod4: { 
                name: "Pancingan Emas", 
                price: 100000, 
                type: "rod", 
                level: 4, 
                speed: 2.5,
                luck: 50,  // +50% luck
                rarity: "epic"
            },
            rod5: { 
                name: "Pancingan Obsidian", 
                price: 300000, 
                type: "rod", 
                level: 5, 
                speed: 3.0,
                luck: 100, // +100% luck
                rarity: "mythic"
            },
            rod6: { 
                name: "Pancingan Berlian", 
                price: 1000000, 
                type: "rod", 
                level: 6, 
                speed: 3.5,
                luck: 200, // +200% luck
                rarity: "secret"
            },
            rod7: { 
                name: "Pancingan Berlian Merah", 
                price: 10000000, 
                type: "rod", 
                level: 7, 
                speed: 4.0,
                luck: 500,  // +500% luck
                rarity: "divine"
            },
            
            // Umpan - SEKARANG PAKAI LUCK BOOST
            bait1: { 
                name: "🪱 Cacing", 
                price: 50000, 
                type: "bait", 
                effect: "luck", 
                bonus: 50,  // +20% luck sementara
                permanent: true,
                rarity: "common"
            },
            bait2: { 
                name: "🦐 Udang", 
                price: 80000, 
                type: "bait", 
                effect: "luck", 
                bonus: 80,  // +40% luck sementara
                permanent: true,
                rarity: "uncommon"
            },
            bait3: { 
                name: "🐟 Kembung", 
                price: 100000, 
                type: "bait", 
                effect: "luck", 
                bonus: 100,  // +60% luck sementara
                permanent: true,
                rarity: "rare"
            },
            bait4: { 
                name: "🦀 Kepiting", 
                price: 500000, 
                type: "bait", 
                effect: "luck", 
                bonus: 150,  // +80% luck sementara
                permanent: true,
                rarity: "epic"
            },
            bait5: { 
                name: "🦑 Cumi", 
                price: 800000, 
                type: "bait", 
                effect: "luck", 
                bonus: 200, // +100% luck sementara
                permanent: true,
                rarity: "mythic"
            },
            bait6: { 
                name: "🍖 Daging", 
                price: 1200000, 
                type: "bait", 
                effect: "luck", 
                bonus: 300,
                permanent: true,
                rarity: "secret"
            },
            bait7: { 
                name: "🔴 Pelet Ajaib", 
                price: 5000000, 
                type: "bait", 
                effect: "luck", 
                bonus: 500,
                permanent: true,
                rarity: "divine"
            },

            // Booster - TETAP SAMA
            speed1: { 
                name: "🌀 Pashen", 
                price: 5000, 
                type: "booster", 
                effect: "speed", 
                multiplier: 2, 
                duration: 5 * 60 * 1000
            },
            luck1: { 
                name: "🍀 Jimat", 
                price: 5000, 
                type: "booster", 
                effect: "luck", 
                multiplier: 2, 
                duration: 5 * 60 * 1000
            },
            speed2: { 
                name: "🌀 Pashen II", 
                price: 10000, 
                type: "booster", 
                effect: "speed", 
                multiplier: 3, 
                duration: 5 * 60 * 1000
            },
            luck2: { 
                name: "🍀 Jimat II", 
                price: 10000, 
                type: "booster", 
                effect: "luck", 
                multiplier: 3, 
                duration: 5 * 60 * 1000
            },
            speed3: { 
                name: "🌀 Pashen III", 
                price: 20000, 
                type: "booster", 
                effect: "speed", 
                multiplier: 4, 
                duration: 5 * 60 * 1000
            },
            luck3: { 
                name: "🍀 Jimat III", 
                price: 20000, 
                type: "booster", 
                effect: "luck", 
                multiplier: 5, 
                duration: 5 * 60 * 1000
            },
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
                    { name: "Kura-Kura", rarity: "epic", price: 1000, emoji: "🐢" },
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
                    { name: "Kraken", rarity: "secret", price: 30000, emoji: "🦑" },
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
                    { name: "Kepiting Lava", rarity: "rare", price: 800, emoji: "🦀" },
                    { name: "Cacing Api", rarity: "epic", price: 1200, emoji: "🪱" },                        
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
                    { name: "Kura-Kura", rarity: "epic", price: 1000, emoji: "🐢" },
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
                    { name: "Anjing Laut", rarity: "epic", price: 1500, emoji: "🦭" },
                    { name: "Paus", rarity: "mythic", price: 5000, emoji: "🐳" },
                    { name: "Putri Duyung", rarity: "secret", price: 30000, emoji: "🧜‍♀️" },
                    { name: "Megalodon", rarity: "secret", price: 50000, emoji: "🦈" }
                ]
            },
            atlantis: {
                name: "Kedalaman Atlantis",
                unlockCost: 20000000,
                fish: [
                    { name: "Karang", rarity: "common", price: 200, emoji: "🪸" },
                    { name: "Ubur-Ubur", rarity: "common", price: 200, emoji: "🪼" },
                    { name: "Udang", rarity: "uncommon", price: 600, emoji: "🦐" },
                    { name: "Lobster", rarity: "rare", price: 1000, emoji: "🦞" },
                    { name: "Kerang Tiram", rarity: "rare", price: 1000, emoji: "🦪" },
                    { name: "Mutiara", rarity: "epic", price: 2000, emoji: "⚪" },
                    { name: "Paus", rarity: "mythic", price: 5000, emoji: "🐳" },
                    { name: "Lumba-Lumba", rarity: "mythic", price: 5000, emoji: "🐬" },
                    { name: "Megalodon", rarity: "secret", price: 50000, emoji: "🦈" },
                    { name: "King Neptune", rarity: "divine", price: 500000, emoji: "🧜‍♂️" }
                ]
            },
            kitchen: {
                name: "Dapur Minyak",
                unlockCost: 500000,
                fish: [
                    { name: "Kentang Goreng", rarity: "common", price: 500, emoji: "🍟" },
                    { name: "Cookie", rarity: "common", price: 500, emoji: "🍪" },
                    { name: "Steak", rarity: "uncommon", price: 800, emoji: "🥩" },
                    { name: "Ayam Goreng", rarity: "uncommon", price: 800, emoji: "🍗" },
                    { name: "Kebab", rarity: "rare", price: 1000, emoji: "🌯" },
                    { name: "Croissant", rarity: "epic", price: 1500, emoji: "🥐" },
                    { name: "Minyak", rarity: "junk", price: 100, emoji: "🧈" }
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

            let rodText = shopItems[currentRod].name;
            if (
                currentBait &&
                shopItems[currentBait] &&
                ownedBaits.includes(currentBait)
            ) {
                rodText += " + " + shopItems[currentBait].name;
            } else {
                currentBait = null;
            }

            rodLevelElement.textContent = rodText;
            totalFishElement.textContent = totalFishCaught.toLocaleString();
            fishingSpeedElement.textContent = fishingSpeed.toFixed(1) + 'x';

            // Hitung dan tampilkan total luck
            let totalLuck = (shopItems[currentRod].luck || 0) + permanentLuckBonus;

            // Tambah luck dari umpan aktif (jika dimiliki)
            if (currentBait && activeBaits.luck && ownedBaits.includes(currentBait)) {
                totalLuck += activeBaits.luck.bonus;
            }

            // Apply luck booster multiplier (jika ada)
            if (activeBoosters.luck) {
                totalLuck *= activeBoosters.luck.multiplier;
            }

            // Update tampilan luck
            document.getElementById('totalLuck').textContent = Math.round(totalLuck) + '%';

            // Perbarui background & tampilan visual pancingan
            updateLocationBackground();
            const rodElement = document.querySelector('.fishing-rod');
            if (rodElement) {
                rodElement.className = 'fishing-rod ' + currentRod;
                console.log('🎣 Rod visual updated to:', currentRod);
            }
        }

        function gainExp(amount) {
            if (playerLevel >= maxLevel) return;
            playerExp += amount;
            if (playerExp >= playerExpCap) {
                levelUp();
            }
            updateExpBar();
        }

        function levelUp() {
            if (playerLevel >= maxLevel) return;
            playerExp -= playerExpCap;
            playerLevel++;
            playerExpCap += 30;
            permanentLuckBonus += 2;
            if (playerLevel > maxLevel) {
                playerLevel = maxLevel;
                playerExp = playerExpCap;
            }
            updateExpBar();
            updateUI();
        }

        function updateExpBar() {
            const expProgress = document.getElementById('expProgress');
            const expText = document.getElementById('expText');
            const playerLevelEl = document.getElementById('playerLevel');
            const percent = Math.min((playerExp / playerExpCap) * 100, 100);
            expProgress.style.width = percent + '%';
            expText.textContent = `${playerExp} / ${playerExpCap}`;
            playerLevelEl.textContent = playerLevel;
        }

        function updateLocationBackground() {
            const allBg = document.querySelectorAll('.location-background');
            const newBg = document.getElementById(currentLocation + 'Bg');
            
            allBg.forEach(bg => {
                bg.classList.remove('active-bg');
            });
            
            // Gunakan class transition bawaan CSS (opacity 1s)
            if (newBg) {
                newBg.classList.add('active-bg');
            }
        }

        // Panggil saat game di-load
        document.addEventListener('DOMContentLoaded', function() {
            initGame();
            // Pastikan posisi awal correct
            setTimeout(resetFishermanPosition, 100);
        });

        // Handle window resize untuk menjaga posisi
        function handleResize() {
            if (!fishermanElement.classList.contains('walking')) {
                resetFishermanPosition();
            }
        }

        window.addEventListener('resize', handleResize);

        // Urutan lokasi yang baru: Sungai -> Rawa -> Danau -> Kawah -> Hutan -> Laut
        const locationOrder = ['river', 'swamp', 'lake', 'volcano', 'forest', 'ocean', 'atlantis', 'kitchen'];

        // Update Location Buttons
        function updateLocationButtons() {
            const locationEmojis = {
                river: '💧',
                swamp: '🪷', 
                lake: '🛶',
                volcano: '🌋',
                forest: '🌲',
                ocean: '🌊',
                atlantis: '🏛️',
                kitchen: '🍳'
            };
            
            const locationNames = {
                river: 'Sungai',
                swamp: 'Rawa',
                lake: 'Danau', 
                volcano: 'Kawah',
                forest: 'Hutan',
                ocean: 'Laut',
                atlantis: 'Atlantis',
                kitchen: 'Dapur'
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
        
        // VERSI SIMPLE & RELIABLE: Change Location tanpa animasi berjalan yang bermasalah
        function changeLocation(location) {
            if (unlockedLocations.includes(location) && location !== currentLocation) {
                console.log('🚶 Pindah ke lokasi:', location);
                
                // Hentikan semua aktivitas fishing
                if (isFishing) {
                    isFishing = false;
                    fishermanElement.classList.remove('fishing');
                    progressBarElement.style.width = '0%';
                    castButton.disabled = false;
                }
                
                const wasAutoFishing = isAutoFishing;
                if (isAutoFishing) {
                    isAutoFishing = false;
                    autoFishBtn.classList.remove('active');
                    fishermanElement.classList.remove('auto-fishing');
                }
                
                // Reset fisherman ke posisi normal
                resetFishermanPosition();
                
                // Tambah efek transisi halus
                document.querySelector('.game-world').classList.add('location-transition');
                
                // Update lokasi dan background
                currentLocation = location;
                updateLocationBackground();
                updateLocationButtons();
                
                // Feedback visual
                resultElement.textContent = `Tiba di ${fishData[location].name}! Siap memancing!`;
                
                // Hapus efek transisi setelah selesai
                setTimeout(() => {
                    document.querySelector('.game-world').classList.remove('location-transition');
                }, 800);
                
                // Lanjutkan auto fishing jika sebelumnya aktif
                if (wasAutoFishing) {
                    setTimeout(() => {
                        isAutoFishing = true;
                        autoFishBtn.classList.add('active');
                        fishermanElement.classList.add('auto-fishing');
                        if (!isFishing) {
                            startFishing();
                        }
                    }, 1000);
                }
            }
        }        

        // Panggil debug saat pindah lokasi (sementara)
        function changeLocation(location) {
            if (unlockedLocations.includes(location)) {
                console.log('🚶 Pindah ke lokasi:', location);
                debugLocationChange(); // Debug sebelum
                
                // Update lokasi terlebih dahulu untuk background
                currentLocation = location;
                updateLocationBackground();
                updateLocationButtons();
                
                // Setup animasi berjalan
                fishermanElement.style.left = '-100px';
                fishermanElement.classList.add('walking');
                
                resultElement.textContent = `🚶 Berpindah ke ${fishData[location].name}...`;
                
                setTimeout(() => {
                    fishermanElement.classList.remove('walking');
                    fishermanElement.style.left = '100px';
                    
                    resultElement.textContent = `Tiba di ${fishData[location].name}! Siap memancing!`;
                    debugLocationChange(); // Debug setelah
                    
                    if (isAutoFishing && !isFishing) {
                        setTimeout(() => {
                            startFishing();
                        }, 1000);
                    }
                }, 1500);
            }
        }

        // Handle window resize untuk posisi fisherman
        function handleResize() {
            // Reset posisi fisherman ke posisi default
            if (!fishermanElement.classList.contains('walking')) {
                fishermanElement.style.left = '100px';
            }
        }

        // Add event listener untuk resize
        window.addEventListener('resize', handleResize);

        // Unlock Location dengan Animasi
        function unlockLocation(location) {
            const cost = fishData[location].unlockCost;
            
            if (gold >= cost) {
                gold -= cost;
                unlockedLocations.push(location);
                updateUI();
                updateLocationButtons();
                
                resultElement.textContent = `Berhasil membuka ${fishData[location].name}!`;
                
                // Pindah ke lokasi baru dengan animasi
                setTimeout(() => {
                    changeLocation(location);
                }, 500);
            } else {
                resultElement.textContent = `Coin tidak cukup! Butuh ${cost.toLocaleString()} 🪙`;
            }
        }

        // Panggil debug saat pindah lokasi (sementara)
        function changeLocation(location) {
            if (unlockedLocations.includes(location)) {
                fishermanElement.classList.add('walking');
                
                setTimeout(() => {
                    currentLocation = location;
                    updateUI();
                    updateLocationButtons();
                    
                    resultElement.textContent = `Pindah ke ${fishData[location].name}!`;
                    
                    // PERBAIKAN: Pastikan background berubah
                    updateLocationBackground();
                    
                    // Debug
                    debugBackgrounds();
                    
                    fishermanElement.classList.remove('walking');
                }, 500);
            }
        }

        // Start Fishing
        function startFishing() {
            if (isFishing) return;
            
            isFishing = true;
            castButton.disabled = true;
            fishermanElement.classList.add('fishing');
            
        // 🎣 Animasi tali terlempar saat mulai memancing
            const line = document.querySelector('.fishing-line');
            if (line) {
                line.classList.add('cast'); // tampil dan tetap ada selama memancing
            }

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
            
            gainExp(1);

            // 🎣 Sembunyikan tali saat memancing selesai
            const line = document.querySelector('.fishing-line');
            if (line) {
                line.classList.remove('cast');
            }

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
        
        // Logika Tangkap Ikan
        function catchFish() {
            const locationFish = fishData[currentLocation].fish;

            // 🎯 Peluang dasar di 0% luck
            const baseChance = {
                divine: 0.00001,
                secret: 0.0001,
                mythic: 0.001,
                epic: 0.5,
                rare: 1.0,
                uncommon: 10.0,
                common: 70.0,
                junk: 21.48995
            };

            // 🧮 Total luck (rod + bait + booster)
            let totalLuck = shopItems[currentRod].luck || 0;
            if (activeBaits.luck) totalLuck += activeBaits.luck.bonus;
            if (activeBoosters.luck) totalLuck *= activeBoosters.luck.multiplier;

            // 🎲 Konversi luck ke level (tiap 50% = 1 level)
            const luckLevel = totalLuck / 50;

            // ⚙️ Bonus multiplier per rarity per level
            const luckBonus = {
                divine: 0.05,
                secret: 0.10,     // +10% per level
                mythic: 0.15,     // +15% per level
                epic: 0.20,       // +20% per level
                rare: 0.25,       // +25% per level
                uncommon: 0.10,   // +10% per level
                common: -0.10,    // -10% per level
                junk: -0.20       // -20% per level
            };

            // ⚙️ Floor minimum agar Common & Junk tidak hilang sepenuhnya
            const minChanceFloor = {
                common: 5.0,
                junk: 5.0
            };

            // 🧩 Hitung effectiveLevel dengan softcap (efek luck makin lemah di atas 500%)
            let effectiveLevel;
            if (totalLuck <= 500) {
                // normal sampai 500%
                effectiveLevel = luckLevel;
            } else if (totalLuck <= 1000) {
                // separuh efek di antara 500–1000%
                const extra = (totalLuck - 500) / 50;
                effectiveLevel = 10 + extra * 0.5;
            } else {
                // seperempat efek di atas 1000%
                const extra = (totalLuck - 1000) / 50;
                effectiveLevel = 10 + 5 + extra * 0.25;
            }

            // ⚙️ Hitung peluang akhir tiap rarity
            const adjustedChance = {};
            for (const rarity in baseChance) {
                const base = baseChance[rarity];
                const bonus = luckBonus[rarity] * effectiveLevel;

                let chance = base * (1 + bonus);

                // Terapkan floor (common/junk minimal 5%)
                if (minChanceFloor[rarity] !== undefined) {
                    chance = Math.max(chance, minChanceFloor[rarity]);
                }

                if (chance < 0) chance = 0;
                adjustedChance[rarity] = chance;
            }

            // 🎯 Total absolute chance (tanpa normalisasi)
            const totalChance = Object.values(adjustedChance).reduce((a, b) => a + b, 0);

            // 🔀 Tentukan rarity berdasarkan RNG
            const roll = Math.random() * totalChance;
            let cumulative = 0;
            let selectedRarity = 'common';
            for (const [rarity, chance] of Object.entries(adjustedChance)) {
                cumulative += chance;
                if (roll <= cumulative) {
                    selectedRarity = rarity;
                    break;
                }
            }

            // 🎣 Ambil ikan dari rarity yang terpilih
            const availableFish = locationFish.filter(f => f.rarity === selectedRarity);
            if (availableFish.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableFish.length);
                return availableFish[randomIndex];
            }

            // fallback jika data rarity tidak ada
            return locationFish.find(f => f.rarity === 'common') || locationFish[0];
        }

        // Display Fish Caught with Animation - PERBAIKAN
        function displayFishCaught(fish) {
            const fishEmoji = document.createElement('div');
            fishEmoji.className = 'fish-caught';
            fishEmoji.textContent = fish.emoji;
            fishEmoji.style.left = '200px';
            fishEmoji.style.bottom = '220px';
            fishEmoji.style.position = 'absolute';
            fishEmoji.style.zIndex = '15';
            fishEmoji.style.fontSize = '2.5rem';
            fishEmoji.style.opacity = '0';
            
            document.querySelector('.game-world').appendChild(fishEmoji);
            
            // Trigger animation
            setTimeout(() => {
                fishEmoji.style.opacity = '1';
                fishEmoji.style.transition = 'all 1.5s ease-out';
                fishEmoji.style.transform = 'translate(-40px, -130px) scale(1.2)';
            }, 10);
            
            // Remove after animation
            setTimeout(() => {
                fishEmoji.style.opacity = '0';
                setTimeout(() => {
                    if (fishEmoji.parentElement) {
                        fishEmoji.remove();
                    }
                }, 500);
            }, 1500);
            
            // Update result text dengan warna rarity
            let rarityColor = '';
            
            switch(fish.rarity) {
                case 'common': 
                    rarityColor = '#FFFFFF';
                    break;
                case 'uncommon': 
                    rarityColor = '#00b894';
                    break;
                case 'rare': 
                    rarityColor = '#0984e3';
                    break;
                case 'epic': 
                    rarityColor = '#8817fa';
                    break;
                case 'mythic': 
                    rarityColor = '#ff0101';
                    break;
                case 'secret': 
                    rarityColor = '#00FFFF';
                    break;
                case 'divine':
                    rarityColor = '#ffa600ff';
                    break;
                case 'junk': 
                    rarityColor = '#c75102fd';
                    break;
            }
            resultElement.innerHTML = `Anda menangkap <strong style="color: ${rarityColor}">${fish.name} ${fish.emoji}</strong>`;
            updateFishIndex(fish.name);
        }

        // ==================== ✨ CATATAN IKAN OTOMATIS TERUPDATE ✨ ==================== //
        function updateFishIndex(caughtFishName) {
            if (!discoveredFish) discoveredFish = JSON.parse(localStorage.getItem("discoveredFish") || "{}");

            // Cari ikan yang cocok di semua lokasi
            for (const [locKey, locData] of Object.entries(fishData)) {
                locData.fish.forEach(fish => {
                    if (fish.name === caughtFishName) {
                        const id = `${locKey}_${fish.name}`;
                        discoveredFish[id] = true; // tandai ditemukan
                    }
                });
            }

            // Simpan ke localStorage
            localStorage.setItem("discoveredFish", JSON.stringify(discoveredFish));

            // Kalau modal Catatan Ikan sedang terbuka, langsung refresh tampilannya
            const modal = document.getElementById("fishIndexModal");
            if (modal && modal.style.display === "flex") {
                openFishIndex();
            }
        }

        // ==================== 🔁 Sinkron & Refresh Catatan Ikan ==================== //
        function updateFishIndexFromInventory() {
        if (!discoveredFish) discoveredFish = JSON.parse(localStorage.getItem("discoveredFish") || "{}");
        if (!inventory) return;

        Object.keys(inventory).forEach(fishName => {
            for (const [locKey, locData] of Object.entries(fishData)) {
            locData.fish.forEach(fish => {
                if (fish.name === fishName) {
                const id = `${locKey}_${fish.name}`;
                discoveredFish[id] = true;
                }
            });
            }
        });

        // Simpan hasil sinkronisasi
        localStorage.setItem("discoveredFish", JSON.stringify(discoveredFish));

        // ✅ Perbarui tampilan Catatan Ikan langsung
        updateFishIndexDisplay();
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
            
            resultElement.innerHTML = `Menjual ${fishCount} Ikan Seharga <span style="color:#ffd700; font-weight:bold;">${totalValue.toLocaleString()} 🪙</span>`;
        }
        
        function sellOneFish(fishName) {
            const fish = inventory[fishName];
            if (!fish) return;

            gold += fish.price;
            fish.count--;

            if (fish.count <= 0) {
                delete inventory[fishName];
            }

            updateInventoryDisplay();
            updateUI();

        // 🎨 Pilih warna sesuai rarity
        const rarityColors = {
            common: '#FFFFFF',
            uncommon: '#00b894',
            rare: '#0984e3',
            epic: '#8817fa',
            mythic: '#ff0101',
            secret: '#00FFFF',
            divine: '#ffa600ff',
            junk: '#c75102fd'
        };
        const color = rarityColors[fish.rarity] || '#ffffff';

        // 💬 Pesan hasil jual yang rapi di satu baris
        resultElement.innerHTML = `Jual <span style="color:${color}; font-weight:bold;">${fish.name}</span> ${fish.emoji} Seharga <span style="color:#ffd700; font-weight:bold;">${fish.price.toLocaleString()} 🪙</span>`;
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

        // Update Inventory Display (versi dengan tombol jual 💲)
        function updateInventoryDisplay() {
            const fishCount = Object.keys(inventory).length;

            if (fishCount === 0) {
                inventoryItemsElement.innerHTML = `
                    <div style="text-align: center; width: 100%; opacity: 0.7;">
                        Belum ada ikan yang ditangkap!
                    </div>`;
                return;
            }

            let inventoryHTML = '';

            // Urutkan ikan berdasarkan rarity (langka -> umum)
            const sortedFish = Object.keys(inventory)
                .map(fishName => inventory[fishName])
                .sort((a, b) => {
                    const rarityOrder = {
                        'divine':0,
                        'secret': 1,
                        'mythic': 2,
                        'epic': 3,
                        'rare': 4,
                        'uncommon': 5,
                        'common': 6,
                        'junk': 7
                    };
                    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
                });

            // Tampilkan ikan yang sudah diurutkan
            for (const fish of sortedFish) {
                const isLocked = lockedFish[fish.name];
                let rarityClass = '';
                
                switch (fish.rarity) {
                    case 'common': rarityClass = 'rarity-common'; break;
                    case 'uncommon': rarityClass = 'rarity-uncommon'; break;
                    case 'rare': rarityClass = 'rarity-rare'; break;
                    case 'epic': rarityClass = 'rarity-epic'; break;
                    case 'mythic': rarityClass = 'rarity-mythic'; break;
                    case 'secret': rarityClass = 'rarity-secret'; break;
                    case 'divine': rarityClass = 'rarity-divine'; break;
                    case 'junk': rarityClass = 'rarity-junk'; break;
                }

        inventoryHTML += `
            <div class="inventory-item ${isLocked ? 'locked' : ''}">
                <!-- 💲 Tombol jual ikan (hanya muncul jika tidak dikunci) -->
                ${!isLocked ? `
                    <button class="sell-fish-btn" onclick="sellOneFish('${fish.name}')" title="Jual 1">💲</button>
                ` : ''}

                <!-- 🔒 Tombol kunci ikan -->
                <button class="lock-btn" onclick="toggleFishLock('${fish.name}')" title="${isLocked ? 'Buka Kunci' : 'Kunci'}">
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
            
            // Display active boosters
            for (const type in activeBoosters) {
                const booster = activeBoosters[type];
                const timeLeft = Math.ceil((booster.expires - now) / 1000 / 60);
                boostersHTML += `<div class="booster-item">${booster.name} (${timeLeft}m)</div>`;
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
            const shopItems = document.querySelectorAll('.shop-item');

            shopItems.forEach(shopItem => {
                // Ambil ID item, dari data-attribute atau dari onclick
                let itemId = shopItem.getAttribute('data-item-id');
                if (!itemId) {
                    const onclickAttr = shopItem.getAttribute('onclick');
                    const match = onclickAttr && onclickAttr.match(/buyItem\('([^']+)'\)/);
                    if (match) itemId = match[1];
                }

                // Reset tampilan awal toko
                shopItem.classList.remove('owned', 'current-rod', 'current-bait');
                const ownedBadge = shopItem.querySelector('.owned-badge');
                if (ownedBadge) ownedBadge.remove();
                const priceElement = shopItem.querySelector('.item-price');
                if (priceElement) priceElement.style.display = '';

                // Deteksi jenis item
                const isRod = itemId && itemId.startsWith('rod');
                const isBait = itemId && itemId.startsWith('bait');

                // Tandai barang yang sudah dimiliki
                if (isRod && ownedRods.includes(itemId)) {
                    shopItem.classList.add('owned');
                    if (!shopItem.querySelector('.owned-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'owned-badge';
                        badge.textContent = '✓ Sudah Punya';
                        shopItem.appendChild(badge);
                    }
                    if (priceElement) priceElement.style.display = 'none';
                }

                if (isBait && ownedBaits.includes(itemId)) {
                    shopItem.classList.add('owned');
                    if (!shopItem.querySelector('.owned-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'owned-badge';
                        badge.textContent = '✓ Sudah Punya';
                        shopItem.appendChild(badge);
                    }
                    if (priceElement) priceElement.style.display = 'none';
                }

                // Tandai barang yang sedang digunakan
                if (isRod && currentRod === itemId) {
                    shopItem.classList.add('current-rod');
                }
                if (isBait && currentBait === itemId) {
                    shopItem.classList.add('current-bait');
                }
            });
        }

        // Update tampilan visual pancingan sesuai level
        const rodElement = document.querySelector('.fishing-rod');
        if (rodElement) {
            // Hapus semua class rod sebelumnya
            rodElement.className = 'fishing-rod ' + currentRod;
        }
        
        // Open Rod Selector (updated layout: RARITY before Pandingan, same style as shop)
        function openRodSelector() {
            document.getElementById('fishSelectorModal') && closeFishSelector(); // tutup modal ikan jika buka (aman)
            // jika modal sudah ada, buang dulu
            const existing = document.querySelector('.rod-selector-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.className = 'rod-selector-modal';
            modal.innerHTML = `
                <div class="rod-selector-content">
                    <h2>Pilih Pancingan</h2>
                    <div id="rodList" class="rod-list-grid"></div>
                    <button class="rod-close-btn">Tutup</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Tutup tombol
            modal.querySelector('.rod-close-btn').addEventListener('click', closeRodSelector);

            const rodList = modal.querySelector('#rodList');
            rodList.innerHTML = '';

            // Render semua owned rods (urutkan level ascending agar konsisten)
            const sortedOwned = [...ownedRods].sort((a,b) => (shopItems[a].level || 0) - (shopItems[b].level || 0));

            sortedOwned.forEach(rodId => {
                const rod = shopItems[rodId];
                const isActive = (rodId === currentRod);

                const rodEl = document.createElement('div');
                rodEl.className = `rod-option ${isActive ? 'active' : ''}`;

                // Struktur: rarity pill lalu nama (sejajar kiri-kanan di dalam satu baris)
                rodEl.innerHTML = `
                    <div class="rod-header">
                        <div class="rod-rarity-badge rarity-${rod.rarity}">
                            ${rod.rarity.charAt(0).toUpperCase() + rod.rarity.slice(1)}
                        </div>
                        <div class="rod-name">${rod.name}</div>
                    </div>

                    <div class="rod-stats">
                        ⚡ Kecepatan: x${rod.speed} &nbsp; | &nbsp; 🍀 Luck: +${rod.luck || 0}%
                    </div>

                    ${isActive ? '<div class="active-tag">Sedang Dipakai</div>' : ''}
                `;

                rodEl.addEventListener('click', () => changeRod(rodId));
                rodList.appendChild(rodEl);
            });
        }
        
        function changeRod(rodId) {
            if (!ownedRods.includes(rodId)) {
                showAdminMessage("❌ Kamu belum memiliki pancingan ini!");
                return;
            }
            currentRod = rodId;
            fishingSpeed = shopItems[rodId].speed || 1;
            updateUI();
            updateShopDisplay();
            closeRodSelector();
            showSaveMessage(`✅ Mengganti pancingan menjadi ${shopItems[rodId].name}`);
        }

        // Tutup modal
        function closeRodSelector() {
            const modal = document.querySelector('.rod-selector-modal');
            if (modal) modal.remove();
        }

        // Ganti pancingan aktif
        function changeRod(rodId) {
            if (!ownedRods.includes(rodId)) {
                alert("❌ Kamu belum memiliki pancingan ini!");
                return;
            }
            currentRod = rodId;
            fishingSpeed = shopItems[rodId].speed;
            updateUI();
            updateShopDisplay();
            showSaveMessage(`✅ Mengganti pancingan menjadi ${shopItems[rodId].name}`);
            closeRodSelector();
        }

        function openBaitSelector() {
            const existing = document.querySelector('.bait-selector-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.className = 'bait-selector-modal';
            modal.innerHTML = `
                <div class="bait-selector-content">
                    <h2>Pilih Umpan</h2>
                    <div id="baitList" class="bait-list-grid"></div>
                    <button class="bait-close-btn">Tutup</button>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.bait-close-btn').addEventListener('click', closeBaitSelector);

            const baitList = modal.querySelector('#baitList');
            baitList.innerHTML = '';

            // Urutkan berdasarkan rarity
            const sortedOwned = [...ownedBaits].sort((a,b) => {
                const rarityOrder = {
                    'common': 1,
                    'uncommon': 2,
                    'rare': 3,
                    'epic': 4,
                    'mythic': 5,
                    'secret': 6
                };
                return rarityOrder[shopItems[a].rarity] - rarityOrder[shopItems[b].rarity];
            });

            sortedOwned.forEach(baitId => {
                const bait = shopItems[baitId];
                const isActive = (baitId === currentBait);

                const baitEl = document.createElement('div');
                baitEl.className = `bait-option ${isActive ? 'active' : ''}`;
                baitEl.innerHTML = `
                    <div class="bait-header">
                        <div class="bait-rarity-badge rarity-${bait.rarity}">
                            ${bait.rarity.charAt(0).toUpperCase() + bait.rarity.slice(1)}
                        </div>
                        <div class="bait-name">${bait.name}</div>
                    </div>
                    <div class="bait-stats">
                        🍀 Bonus Luck: +${bait.bonus}%
                    </div>
                    ${isActive ? '<div class="active-tag">Sedang Dipakai</div>' : ''}
                `;
                baitEl.addEventListener('click', () => changeBait(baitId));
                baitList.appendChild(baitEl);
            });
        }

        function closeBaitSelector() {
            const modal = document.querySelector('.bait-selector-modal');
            if (modal) modal.remove();
        }

        function changeBait(baitId) {
            if (!ownedBaits.includes(baitId)) {
                resultElement.textContent = "❌ Kamu belum memiliki umpan ini!";
                return;
            }

            currentBait = baitId;
            const bait = shopItems[baitId];
            activeBaits = {
                luck: {
                    name: bait.name,
                    bonus: bait.bonus
                }
            };

            updateUI();
            closeBaitSelector();
            resultElement.textContent = `✅ Mengganti umpan menjadi ${bait.name} (+${bait.bonus}% luck)!`;
        }
        
        // Buy Item
        function buyItem(itemId) {
            const item = shopItems[itemId];
            
            if (!item) {
                resultElement.textContent = "Item tidak ditemukan!";
                return;
            }
            
            if (gold < item.price) {
                resultElement.textContent = `Tidak cukup Coin! Butuh ${item.price.toLocaleString()} 🪙`;
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
                resultElement.textContent = `Membeli${ownedRods.includes(itemId) ?'' : 'membeli'} ${item.name} Kecepatan memancing ${fishingSpeed}x`;
                
                // Update tampilan toko
                updateShopDisplay();
            }
            else if (item.type === 'bait') {
                // Jika belum punya umpan ini, tambahkan
                if (!ownedBaits.includes(itemId)) {
                    ownedBaits.push(itemId);
                    resultElement.textContent = `Membeli ${item.name}!`;
                } else {
                    resultElement.textContent = `${item.name} sudah dimiliki.`;
                }

                // Jadikan umpan ini aktif
                currentBait = itemId;
                activeBaits = {
                    luck: {
                        name: item.name,
                        bonus: item.bonus
                    }
                };

                updateUI();
                updateShopDisplay();
            }
            else if (item.type === 'booster') {
                // Activate booster
                activeBoosters[item.effect] = {
                    name: item.name,
                    multiplier: item.multiplier,
                    expires: Date.now() + item.duration
                };
                resultElement.textContent = `Membeli ${item.name}! Efek aktif selama ${item.duration / 60000} menit.`;
            }
            
            updateUI();
            updateActiveBoosters();
            closeShop();
        }
        
        // Simpan data ikan yang sudah pernah ditangkap
        let discoveredFish = JSON.parse(localStorage.getItem("discoveredFish") || "{}");

        function openFishIndex() {
            const modal = document.getElementById("fishIndexModal");
            const container = document.getElementById("fishIndexContainer");
            container.innerHTML = "";

            // Hitung total & jumlah ditemukan (untuk info header)
            let totalFish = 0;
            let discoveredCount = 0;
            for (const locKey in fishData) {
                totalFish += fishData[locKey].fish.length;
                fishData[locKey].fish.forEach(fish => {
                    const id = `${locKey}_${fish.name}`;
                    if (discoveredFish[id]) discoveredCount++;
                });
            }

            // Tambahkan judul dengan progres
            const summary = document.createElement("div");
            summary.style.textAlign = "center";
            summary.style.marginBottom = "15px";
            summary.innerHTML = `
                <p style="opacity:0.8;">${discoveredCount} / ${totalFish} ikan telah ditemukan</p>
            `;
            container.appendChild(summary);

            // Loop per lokasi
            for (const [locKey, location] of Object.entries(fishData)) {
                const section = document.createElement("div");
                section.className = "fish-index-section";
                section.innerHTML = `<h3 style="color:#4ECDC4; margin-top:10px;">${location.name}</h3>`;

                const grid = document.createElement("div");
                grid.className = "fish-selection-grid";

                location.fish.forEach(fish => {
                    const fishId = `${locKey}_${fish.name}`;
                    const isDiscovered = discoveredFish[fishId];
                    const item = document.createElement("div");
                    item.className = "fish-item";

                    if (isDiscovered) {
                        item.innerHTML = `
                            <div class="fish-emoji">${fish.emoji}</div>
                            <div class="fish-name">${fish.name}</div>
                            <div class="rarity-label rarity-${fish.rarity}">
                                ${fish.rarity.toUpperCase()}
                            </div>
                        `;
                    } else {
                        item.innerHTML = `
                            <div class="fish-emoji">❓</div>
                            <div class="fish-name">???</div>
                            <div class="fish-rarity">???</div>
                        `;
                        item.style.opacity = "0.4";
                    }

                    grid.appendChild(item);
                });

                section.appendChild(grid);
                container.appendChild(section);
            }

            modal.style.display = "flex";
        }

        function closeFishIndex() {
            document.getElementById("fishIndexModal").style.display = "none";
        }

        // Panggil ini setiap kali pemain menangkap ikan
        function markFishAsDiscovered(locationKey, fishName) {
            const fishId = `${locationKey}_${fishName}`;
            discoveredFish[fishId] = true;
            localStorage.setItem("discoveredFish", JSON.stringify(discoveredFish));
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
            if (password === "Admin345876") {
                document.getElementById('adminModal').classList.add('active');
            } else if (password) {
                alert("Kode admin salah!");
            }
        }

        // Keyboard shortcut untuk buka admin panel (Ctrl+Shift+A) Wajib nyalakan Capslock
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'y') {
                e.preventDefault();
                openAdminModal();
            }
        });

        function showAdminMessage(message) {
            resultElement.textContent = message;
        }
        
        function closeAdminModal() {
            document.getElementById('adminModal').classList.remove('active');
        }

        function addCustomGold() {
            const input = document.getElementById('customGold');
            const amount = parseInt(input.value);
            
            if (amount && amount > 0) {
                gold += amount;
                updateUI();
                showAdminMessage(`+${amount.toLocaleString()} Coin ditambahkan!`);
                input.value = '';
            } else {
                alert("Masukkan jumlah Coin yang valid!");
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
            updateFishIndexFromInventory();

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
                currentBait: currentBait,
                ownedBaits: ownedBaits,
                timestamp: Date.now(),

                playerLevel: playerLevel,
                playerExp: playerExp,
                playerExpCap: playerExpCap,
                permanentLuckBonus: permanentLuckBonus
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
                    currentBait = saveData.currentBait || 'bait1';
                    ownedBaits = saveData.ownedBaits || ['bait1'];

                    playerLevel = saveData.playerLevel ?? 1;
                    playerExp = saveData.playerExp ?? 0;
                    playerExpCap = saveData.playerExpCap ?? 50;
                    permanentLuckBonus = saveData.permanentLuckBonus ?? 0;
                    updateExpBar();
                    updateUI();
                    updateShopDisplay();

                    console.log('Game loaded!');
                    return true;
                } catch (error) {
                    console.error('Error loading save:', error);
                    return false;
                }
            }
            return false;
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
                updateFishIndexFromInventory();
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

        // Initialize Game
        function initGame() {
            ensureVersionCompatibility();
            updateVersionDisplay();
            
            if (!loadGame()) {
                console.log('No save data found, starting new game');
            }
            
            // PERBAIKAN: Pastikan background dan posisi fisherman benar
            updateLocationBackground();
            
            // Pastikan fisherman di posisi yang benar
            fishermanElement.style.left = '100px';
            fishermanElement.classList.remove('walking');
            
            updateUI();
            updateLocationButtons();
            updateInventoryDisplay();
            updateActiveBoosters();
            updateShopDisplay();
            updateSaveStatus();
            startAutoSave();
            
            console.log('🎮 Game initialized dengan lokasi:', currentLocation);
        }
            
        // ==================== FITUR EXPORT / IMPORT / RESET DATA ====================
        // Export data ke file JSON
        function exportData() {
            const saveData = localStorage.getItem('mancing_mania_save');
            if (!saveData) {
                alert("⚠️ Tidak ada data yang bisa diexport!");
                return;
            }
            const blob = new Blob([saveData], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "MancingMania_SaveData.json";
            link.click();
            alert("✅ Data berhasil diexport!");
        }

        // Import data dari file JSON
        function importData() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";

            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const json = JSON.parse(event.target.result);
                        localStorage.setItem("mancing_mania_save", JSON.stringify(json));
                        alert("✅ Data berhasil diimport! Muat ulang game untuk menerapkan perubahan.");
                        location.reload();
                    } catch {
                        alert("❌ Gagal membaca file. Pastikan file JSON valid.");
                    }
                };
                reader.readAsText(file);
            };

            input.click();
        }

        // Reset seluruh data game
        function resetGame() {
            if (confirm("⚠️ Semua progres akan hilang! Yakin ingin reset data?")) {
                localStorage.removeItem("mancing_mania_save");
                localStorage.removeItem("game_version");
                localStorage.removeItem("discoveredFish");
                alert("Data berhasil dihapus Game akan dimulai ulang");
                location.reload();
            }
        }

            // Tampilkan info save status
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const saveData = JSON.parse(saved);
                const saveTime = new Date(saveData.timestamp).toLocaleTimeString();
                console.log(`Last save: ${saveTime}`);
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

