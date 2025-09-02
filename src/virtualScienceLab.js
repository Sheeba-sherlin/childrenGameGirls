// VirtualScienceLab.js
import * as THREE from 'three';

class VirtualScienceLab {
    constructor() {
        // Global variables
        this.currentExperiment = null;
        this.circuitState = { current: false, resistance: 100 };
        this.pendulumState = { swinging: false, angle: 0, period: 0 };
        this.pendulumInterval = null;
        this.pendulumStartTime = 0;

        // Volcano experiment variables
        this.volcanoScene = null;
        this.volcanoCamera = null;
        this.volcanoRenderer = null;
        this.volcanoBottle = null;
        this.volcanoBakingSoda = null;
        this.volcanoVinegar = null;
        this.volcanoBubbles = [];
        this.volcanoCurrentStep = 1;
        this.volcanoExperimentComplete = false;

        // Hookes experiment variables  
        this.hookesScene = null;
        this.hookesCamera = null;
        this.hookesRenderer = null;
        this.hookesSpring = null;
        this.hookesStand = null;
        this.hookesPointer = null;
        this.hookesRuler = null;
        this.hookesCurrentWeight = null;
        this.hookesWeights = [];
        this.hookesCurrentStep = 1;
        this.hookesNaturalLength = 15;
        this.hookesCurrentLoad = 0;
        this.hookesSpringConstant = 20;
        this.hookesMeasurements = [];
        this.hookesSpringGroup = null;

        this.init();
    }

    init() {
        // Initialize event listeners and setup
        this.setupEventListeners();
        this.updateOhmsObservations();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        if (this.volcanoRenderer && this.volcanoCamera) {
            const canvas = document.getElementById('volcano-canvas');
            if (canvas) {
                this.volcanoRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
                this.volcanoCamera.aspect = canvas.clientWidth / canvas.clientHeight;
                this.volcanoCamera.updateProjectionMatrix();
            }
        }
        
        if (this.hookesRenderer && this.hookesCamera) {
            const canvas = document.getElementById('hookes-canvas');
            if (canvas) {
                this.hookesRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
                this.hookesCamera.aspect = canvas.clientWidth / canvas.clientHeight;
                this.hookesCamera.updateProjectionMatrix();
            }
        }
    }

    // Navigation functions
    openExperiment(experimentId) {
        const indexPage = document.getElementById('index-page');
        const experimentPage = document.getElementById(experimentId + '-page');
        
        if (indexPage) indexPage.classList.add('hidden');
        if (experimentPage) experimentPage.classList.add('active');
        
        this.currentExperiment = experimentId;
    }

    goToIndex() {
        document.querySelectorAll('.experiment-page').forEach(page => {
            page.classList.remove('active');
        });
        
        const indexPage = document.getElementById('index-page');
        if (indexPage) indexPage.classList.remove('hidden');
        
        this.currentExperiment = null;
        this.stopAllAnimations();
    }

    showSection(experimentId, sectionName) {
        document.querySelectorAll(`#${experimentId}-page .content-section`).forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${experimentId}-${sectionName}`);
        if (targetSection) targetSection.classList.add('active');
        
        document.querySelectorAll(`#${experimentId}-page .tab-button`).forEach(button => {
            button.classList.remove('active');
        });
        
        // Find and activate the correct tab button
        const tabButtons = document.querySelectorAll(`#${experimentId}-page .tab-button`);
        tabButtons.forEach(button => {
            if (button.textContent.toLowerCase().includes(sectionName)) {
                button.classList.add('active');
            }
        });
        
        // Initialize 3D scenes when practice tabs are shown
        if (sectionName === 'practice') {
            setTimeout(() => {
                if (experimentId === 'volcano' && !this.volcanoScene) {
                    this.initVolcano3DScene();
                } else if (experimentId === 'hookes' && !this.hookesScene) {
                    this.initHookes3DScene();
                }
            }, 100);
        }
    }

    stopAllAnimations() {
        if (this.pendulumInterval) {
            clearInterval(this.pendulumInterval);
            this.pendulumInterval = null;
        }
        this.pendulumState.swinging = false;
        this.circuitState.current = false;
        
        const currentFlow = document.getElementById('current-flow');
        if (currentFlow) currentFlow.style.display = 'none';
    }

    // Theory video playback simulation
    playTheoryVideo(experiment, event) {
        const videoContainer = event.currentTarget;
        const playButton = videoContainer.querySelector('.play-button');
        
        playButton.innerHTML = '<div class="loading-spinner"></div>';
        
        setTimeout(() => {
            playButton.innerHTML = `
                <div style="font-size: 1.2em; text-align: center;">
                    <div style="margin-bottom: 10px;">📽️</div>
                    <div>Playing ${experiment} theory video...</div>
                    <div style="font-size: 0.8em; margin-top: 10px;">Interactive explanation in progress!</div>
                </div>
            `;
            
            setTimeout(() => {
                videoContainer.style.background = 'linear-gradient(45deg, #4ECDC4, #44A08D)';
                playButton.innerHTML = `
                    <div style="font-size: 1em; text-align: center;">
                        <div>✅ Video Complete!</div>
                        <div style="font-size: 0.9em; margin-top: 10px;">Try the practice experiment!</div>
                    </div>
                `;
            }, 3000);
        }, 1000);
    }

    // VOLCANO EXPERIMENT FUNCTIONS
    initVolcano3DScene() {
        this.volcanoScene = new THREE.Scene();
        this.volcanoScene.background = new THREE.Color(0x87CEEB);

        this.volcanoCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.volcanoCamera.position.set(0, 2, 5);

        const canvas = document.getElementById('volcano-canvas');
        if (!canvas) return;
        
        this.volcanoRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.volcanoRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.volcanoRenderer.shadowMap.enabled = true;
        this.volcanoRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.volcanoScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.volcanoScene.add(directionalLight);

        // Create lab table
        const tableGeometry = new THREE.BoxGeometry(6, 0.2, 4);
        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -1;
        table.receiveShadow = true;
        this.volcanoScene.add(table);

        // Create bottle (volcano)
        const bottleGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 16);
        const bottleMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x228B22, 
            transparent: true, 
            opacity: 0.7 
        });
        this.volcanoBottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
        this.volcanoBottle.position.set(0, 0, 0);
        this.volcanoBottle.castShadow = true;
        this.volcanoScene.add(this.volcanoBottle);

        this.createVolcanoMountain();
        this.createVolcanoLabEquipment();
        this.animateVolcano();
    }

    createVolcanoMountain() {
        const mountainGeometry = new THREE.ConeGeometry(2, 1.5, 8);
        const mountainMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        mountain.position.set(0, -0.5, 0);
        this.volcanoScene.add(mountain);
    }

    createVolcanoLabEquipment() {
        const beakerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12);
        const beakerMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1, 
            transparent: true, 
            opacity: 0.6 
        });
        const beaker = new THREE.Mesh(beakerGeometry, beakerMaterial);
        beaker.position.set(-2, -0.5, 1);
        this.volcanoScene.add(beaker);

        const spoonGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const spoonMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const spoon = new THREE.Mesh(spoonGeometry, spoonMaterial);
        spoon.position.set(1.5, -0.8, 0.5);
        this.volcanoScene.add(spoon);
    }

    animateVolcano() {
        if (!this.volcanoRenderer || !this.volcanoScene || !this.volcanoCamera) return;
        
        requestAnimationFrame(() => this.animateVolcano());

        this.volcanoBubbles.forEach((bubble, index) => {
            bubble.position.y += 0.05;
            bubble.scale.multiplyScalar(1.02);
            
            if (bubble.position.y > 3 || bubble.scale.x > 2) {
                this.volcanoScene.remove(bubble);
                this.volcanoBubbles.splice(index, 1);
            }
        });

        if (this.volcanoBottle) {
            this.volcanoBottle.rotation.y += 0.005;
        }

        this.volcanoRenderer.render(this.volcanoScene, this.volcanoCamera);
    }

    addBakingSoda() {
        if (this.volcanoCurrentStep !== 1) return;

        const sodaGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const sodaMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        this.volcanoBakingSoda = new THREE.Mesh(sodaGeometry, sodaMaterial);
        this.volcanoBakingSoda.position.set(0, 0.5, 0);
        this.volcanoScene.add(this.volcanoBakingSoda);

        const addSodaBtn = document.getElementById('volcano-add-baking-soda');
        const addVinegarBtn = document.getElementById('volcano-add-vinegar');
        if (addSodaBtn) addSodaBtn.disabled = true;
        if (addVinegarBtn) addVinegarBtn.disabled = false;
        
        this.updateVolcanoStep(2, "Great! Now add some vinegar to create the reaction. Click 'Add Vinegar'!");
        this.updateVolcanoObservations("✅ Added white baking soda powder to the bottle.");

        this.volcanoBottle.material.color.setHex(0x90EE90);
        this.addVolcanoSparkles(this.volcanoBottle.position);
    }

    addVinegar() {
        if (this.volcanoCurrentStep !== 2) return;

        const vinegarGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        const vinegarMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFF00, 
            transparent: true, 
            opacity: 0.7 
        });
        this.volcanoVinegar = new THREE.Mesh(vinegarGeometry, vinegarMaterial);
        this.volcanoVinegar.position.set(0, 0.3, 0);
        this.volcanoScene.add(this.volcanoVinegar);

        const addVinegarBtn = document.getElementById('volcano-add-vinegar');
        const mixBtn = document.getElementById('volcano-mix-ingredients');
        if (addVinegarBtn) addVinegarBtn.disabled = true;
        if (mixBtn) mixBtn.disabled = false;
        
        this.updateVolcanoStep(3, "Perfect! Now let's mix them together and watch the magic happen! Click 'Mix & Watch!'");
        this.updateVolcanoObservations("✅ Added vinegar (acid) to the baking soda (base). Ready for reaction!");

        this.volcanoBottle.material.color.setHex(0xFFD700);
        this.addVolcanoSparkles(this.volcanoBottle.position);
    }

    mixIngredients() {
        if (this.volcanoCurrentStep !== 3) return;

        this.createVolcanoEruption();
        
        const mixBtn = document.getElementById('volcano-mix-ingredients');
        if (mixBtn) mixBtn.disabled = true;
        
        this.updateVolcanoStep(4, "🌋 AMAZING! Watch your volcano erupt! The acid and base are reacting to make carbon dioxide gas!");
        this.updateVolcanoObservations("🌋 ERUPTION! Fizzing, bubbling, and foaming as CO₂ gas is produced from the chemical reaction!");

        this.volcanoBottle.material.color.setHex(0xFF4500);
        this.volcanoExperimentComplete = true;
    }

    createVolcanoEruption() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const bubbleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 6);
                const bubbleMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.7),
                    transparent: true,
                    opacity: 0.8
                });
                const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
                
                bubble.position.set(
                    (Math.random() - 0.5) * 0.5,
                    1 + Math.random() * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
                
                this.volcanoBubbles.push(bubble);
                this.volcanoScene.add(bubble);
            }, i * 100);
        }

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.addVolcanoSparkles(this.volcanoBottle.position, 0xFF6B6B);
            }, i * 200);
        }
    }

    addVolcanoSparkles(position, color = 0xFFD700) {
        for (let i = 0; i < 5; i++) {
            const sparkleGeometry = new THREE.SphereGeometry(0.02, 4, 3);
            const sparkleMaterial = new THREE.MeshBasicMaterial({ color: color });
            const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
            
            sparkle.position.set(
                position.x + (Math.random() - 0.5) * 0.8,
                position.y + Math.random() * 0.5,
                position.z + (Math.random() - 0.5) * 0.8
            );
            
            this.volcanoScene.add(sparkle);
            setTimeout(() => this.volcanoScene.remove(sparkle), 1000);
        }
    }

    updateVolcanoStep(step, text) {
        this.volcanoCurrentStep = step;
        const stepCounter = document.getElementById('volcano-step-counter');
        const tutorialText = document.getElementById('volcano-tutorial-text');
        
        if (stepCounter) stepCounter.textContent = `Step ${step} of 4`;
        if (tutorialText) tutorialText.innerHTML = `<strong>Step ${step}:</strong><br>${text}`;
        
        if (step === 4 && stepCounter) {
            stepCounter.textContent = "Complete! 🎉";
        }
    }

    updateVolcanoObservations(text) {
        const observations = document.getElementById('volcano-observations');
        if (observations) {
            observations.innerHTML += '<br>' + text;
            observations.scrollTop = observations.scrollHeight;
        }
    }

    resetVolcanoExperiment() {
        if (this.volcanoBakingSoda) this.volcanoScene.remove(this.volcanoBakingSoda);
        if (this.volcanoVinegar) this.volcanoScene.remove(this.volcanoVinegar);
        this.volcanoBubbles.forEach(bubble => this.volcanoScene.remove(bubble));
        this.volcanoBubbles = [];

        if (this.volcanoBottle) this.volcanoBottle.material.color.setHex(0x228B22);

        const addSodaBtn = document.getElementById('volcano-add-baking-soda');
        const addVinegarBtn = document.getElementById('volcano-add-vinegar');
        const mixBtn = document.getElementById('volcano-mix-ingredients');
        
        if (addSodaBtn) addSodaBtn.disabled = false;
        if (addVinegarBtn) addVinegarBtn.disabled = true;
        if (mixBtn) mixBtn.disabled = true;
        
        this.volcanoCurrentStep = 1;
        this.volcanoExperimentComplete = false;
        
        this.updateVolcanoStep(1, "Welcome back! Click on 'Add Baking Soda' to start your volcano experiment again!");
        const observations = document.getElementById('volcano-observations');
        if (observations) observations.innerHTML = "Click the buttons above to start your experiment!";
    }

    // HOOKE'S LAW FUNCTIONS
    initHookes3DScene() {
        this.hookesScene = new THREE.Scene();
        this.hookesScene.background = new THREE.Color(0x87CEEB);

        this.hookesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.hookesCamera.position.set(3, 5, 8);

        const canvas = document.getElementById('hookes-canvas');
        if (!canvas) return;
        
        this.hookesRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.hookesRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.hookesRenderer.shadowMap.enabled = true;
        this.hookesRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.hookesScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.hookesScene.add(directionalLight);

        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -3;
        floor.receiveShadow = true;
        this.hookesScene.add(floor);

        this.animateHookes();
    }

    setupSpring() {
        if (this.hookesCurrentStep !== 1) return;

        const standGroup = new THREE.Group();
        
        const baseGeometry = new THREE.BoxGeometry(2, 0.2, 2);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -2.8;
        standGroup.add(base);

        const rodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 12);
        const rodMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.position.y = 0.2;
        standGroup.add(rod);

        const supportGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
        const support = new THREE.Mesh(supportGeometry, rodMaterial);
        support.rotation.z = Math.PI / 2;
        support.position.set(0.5, 3, 0);
        standGroup.add(support);

        this.hookesStand = standGroup;
        this.hookesScene.add(this.hookesStand);

        this.hookesSpringGroup = new THREE.Group();
        this.createHookesSpringCoils(this.hookesNaturalLength);
        this.hookesSpringGroup.position.set(1, 3, 0);
        this.hookesScene.add(this.hookesSpringGroup);

        const rulerGeometry = new THREE.BoxGeometry(0.1, 4, 0.05);
        const rulerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
        this.hookesRuler = new THREE.Mesh(rulerGeometry, rulerMaterial);
        this.hookesRuler.position.set(1.5, 1, 0);
        this.hookesScene.add(this.hookesRuler);

        this.addHookesRulerMarkings(this.hookesRuler);

        this.updateHookesStep(2, "Great setup! Now measure the natural length of the spring. Click 'Measure Natural Length'!");
        this.updateHookesObservations(`✅ Added ${this.hookesCurrentLoad}g weight. Spring extended by ${extension.toFixed(1)}cm`);
        
        if (this.hookesCurrentStep === 3) {
            this.updateHookesStep(4, "Weight added! Now measure the extension. Click 'Measure Extension'!");
            const measureExtensionBtn = document.getElementById('hookes-measure-extension');
            if (measureExtensionBtn) measureExtensionBtn.disabled = false;
        }

        this.animateHookesSpringBounce();
    }

    animateHookesSpringBounce() {
        let bounceCount = 0;
        const maxBounces = 5;
        const bounceHeight = 0.1;

        const bounce = () => {
            if (bounceCount >= maxBounces) return;

            const startY = this.hookesSpringGroup.position.y;
            let progress = 0;

            const animateBounce = () => {
                progress += 0.1;
                if (progress >= Math.PI * 2) {
                    this.hookesSpringGroup.position.y = startY;
                    bounceCount++;
                    if (bounceCount < maxBounces) {
                        setTimeout(bounce, 100);
                    }
                    return;
                }

                this.hookesSpringGroup.position.y = startY + Math.sin(progress) * bounceHeight * (1 - bounceCount / maxBounces);
                requestAnimationFrame(animateBounce);
            };

            animateBounce();
        };

        bounce();
    }

    measureExtension() {
        if (this.hookesCurrentStep !== 4) return;

        const force = (this.hookesCurrentLoad / 1000) * 9.81;
        const extension = (force / this.hookesSpringConstant) * 100;
        const calculatedK = force / (extension / 100);

        const measurement = {
            weight: this.hookesCurrentLoad,
            force: force.toFixed(3),
            extension: extension.toFixed(1),
            springConstant: calculatedK.toFixed(1)
        };
        
        this.hookesMeasurements.push(measurement);
        this.updateHookesMeasurementTable();

        if (this.hookesPointer) {
            this.hookesPointer.position.y = this.hookesSpringGroup.position.y - (this.hookesNaturalLength / 10) - (extension / 10);
            
            const extensionGeometry = new THREE.CylinderGeometry(0.01, 0.01, extension / 10, 8);
            const extensionMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
            const extensionIndicator = new THREE.Mesh(extensionGeometry, extensionMaterial);
            extensionIndicator.position.set(1.4, this.hookesSpringGroup.position.y - (this.hookesNaturalLength / 20) - (extension / 20), 0);
            this.hookesScene.add(extensionIndicator);

            setTimeout(() => this.hookesScene.remove(extensionIndicator), 3000);
        }

        this.updateHookesObservations(`✅ Measured extension: ${extension.toFixed(1)}cm for ${this.hookesCurrentLoad}g weight. Spring constant k = ${calculatedK.toFixed(1)} N/m`);

        if (this.hookesCurrentLoad < 200) {
            this.updateHookesStep(4, "Measurement recorded! Add more weights to get multiple data points. Click 'Add Weight'!");
        } else {
            this.updateHookesStep(5, "🎉 Experiment Complete! You've verified Hooke's Law: F = kx");
            this.showHookesResults();
        }

        const measureExtensionBtn = document.getElementById('hookes-measure-extension');
        if (measureExtensionBtn) measureExtensionBtn.disabled = true;
    }

    updateHookesMeasurementTable() {
        const tbody = document.getElementById('hookes-measurement-data');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.hookesMeasurements.forEach(measurement => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = measurement.weight;
            row.insertCell(1).textContent = measurement.force;
            row.insertCell(2).textContent = measurement.extension;
            row.insertCell(3).textContent = measurement.springConstant;
        });
    }

    showHookesResults() {
        if (this.hookesMeasurements.length === 0) return;
        
        const avgK = this.hookesMeasurements.reduce((sum, m) => sum + parseFloat(m.springConstant), 0) / this.hookesMeasurements.length;
        this.updateHookesObservations(`🎯 Average Spring Constant: ${avgK.toFixed(1)} N/m - Hooke's Law verified!`);
    }

    animateHookes() {
        if (!this.hookesRenderer || !this.hookesScene || !this.hookesCamera) return;
        
        requestAnimationFrame(() => this.animateHookes());
        
        if (this.hookesWeights.length > 0) {
            this.hookesWeights.forEach(weight => {
                weight.rotation.y += 0.01;
            });
        }

        this.hookesRenderer.render(this.hookesScene, this.hookesCamera);
    }

    updateHookesStep(step, text) {
        this.hookesCurrentStep = step;
        const stepCounter = document.getElementById('hookes-step-counter');
        const tutorialText = document.getElementById('hookes-tutorial-text');
        
        if (stepCounter) stepCounter.textContent = `Step ${step} of 5`;
        if (tutorialText) tutorialText.innerHTML = `<strong>Step ${step}:</strong><br>${text}`;
        
        if (step === 5 && stepCounter) {
            stepCounter.textContent = "Complete! 🎉";
        }
    }

    updateHookesObservations(text) {
        const observations = document.getElementById('hookes-observations');
        if (observations) {
            observations.innerHTML += '<br>' + text;
            observations.scrollTop = observations.scrollHeight;
        }
    }

    resetHookesExperiment() {
        if (this.hookesStand) this.hookesScene.remove(this.hookesStand);
        if (this.hookesSpringGroup) this.hookesScene.remove(this.hookesSpringGroup);
        if (this.hookesRuler) this.hookesScene.remove(this.hookesRuler);
        if (this.hookesPointer) this.hookesScene.remove(this.hookesPointer);
        
        this.hookesWeights.forEach(weight => this.hookesScene.remove(weight));
        this.hookesWeights = [];
        this.hookesMeasurements = [];

        this.hookesCurrentStep = 1;
        this.hookesCurrentLoad = 0;

        const setupBtn = document.getElementById('hookes-setup-spring');
        const measureNaturalBtn = document.getElementById('hookes-measure-natural');
        const addWeightBtn = document.getElementById('hookes-add-weight');
        const measureExtensionBtn = document.getElementById('hookes-measure-extension');
        const weightDisplay = document.getElementById('hookes-weight-display');
        const measurementsTable = document.getElementById('hookes-measurements-table');

        if (setupBtn) setupBtn.disabled = false;
        if (measureNaturalBtn) measureNaturalBtn.disabled = true;
        if (addWeightBtn) addWeightBtn.disabled = true;
        if (measureExtensionBtn) measureExtensionBtn.disabled = true;
        if (weightDisplay) weightDisplay.style.display = 'none';
        if (measurementsTable) measurementsTable.style.display = 'none';

        this.updateHookesStep(1, "Welcome back! Click 'Setup Spring' to start the Hooke's Law experiment again!");
        const observations = document.getElementById('hookes-observations');
        if (observations) observations.innerHTML = "Click the buttons above to start the experiment!";
        
        const measurementData = document.getElementById('hookes-measurement-data');
        if (measurementData) measurementData.innerHTML = '';
    }

    // OHM'S LAW FUNCTIONS
    toggleCurrent() {
        this.circuitState.current = !this.circuitState.current;
        const currentFlow = document.getElementById('current-flow');
        const resistor = document.querySelector('.resistor');
        
        if (this.circuitState.current) {
            if (currentFlow) currentFlow.style.display = 'block';
            if (resistor) resistor.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
            this.updateOhmsObservations();
        } else {
            if (currentFlow) currentFlow.style.display = 'none';
            if (resistor) resistor.style.background = 'linear-gradient(90deg, #8B4513, #D2691E)';
            this.updateOhmsObservations();
        }
    }

    changeResistance() {
        const resistances = [100, 200, 50, 150];
        const currentIndex = resistances.indexOf(this.circuitState.resistance);
        this.circuitState.resistance = resistances[(currentIndex + 1) % resistances.length];
        
        const resistor = document.querySelector('.resistor');
        const colors = {
            100: 'linear-gradient(90deg, #8B4513, #D2691E)',
            200: 'linear-gradient(90deg, #FF0000, #8B0000)',
            50: 'linear-gradient(90deg, #00FF00, #006400)',
            150: 'linear-gradient(90deg, #0000FF, #000080)'
        };
        
        if (resistor) resistor.style.background = colors[this.circuitState.resistance];
        this.updateOhmsObservations();
    }

    updateOhmsObservations() {
        const voltage = 5;
        const current = this.circuitState.current ? (voltage / this.circuitState.resistance).toFixed(3) : 0;
        const observations = document.getElementById('ohms-observations');
        if (observations) {
            observations.innerHTML = `Voltage: ${voltage}V, Current: ${current}A, Resistance: ${this.circuitState.resistance}Ω`;
        }
    }

    resetCircuit() {
        this.circuitState.current = false;
        this.circuitState.resistance = 100;
        const currentFlow = document.getElementById('current-flow');
        const resistor = document.querySelector('.resistor');
        
        if (currentFlow) currentFlow.style.display = 'none';
        if (resistor) resistor.style.background = 'linear-gradient(90deg, #8B4513, #D2691E)';
        this.updateOhmsObservations();
    }

    // PENDULUM FUNCTIONS
    startPendulum() {
        if (this.pendulumState.swinging) return;
        
        this.pendulumState.swinging = true;
        this.pendulumState.angle = 45;
        this.pendulumStartTime = Date.now();
        
        const pendulumString = document.getElementById('pendulum-string');
        let direction = -1;
        
        this.pendulumInterval = setInterval(() => {
            this.pendulumState.angle += direction * 2;
            
            if (this.pendulumState.angle <= -45) {
                direction = 1;
            } else if (this.pendulumState.angle >= 45) {
                direction = -1;
            }
            
            if (pendulumString) {
                pendulumString.style.setProperty('--pendulum-angle', `${this.pendulumState.angle}deg`);
            }
        }, 50);
        
        this.updatePendulumObservations("Pendulum is swinging...");
    }

    stopPendulum() {
        if (!this.pendulumState.swinging) return;
        
        this.pendulumState.swinging = false;
        if (this.pendulumInterval) {
            clearInterval(this.pendulumInterval);
            this.pendulumInterval = null;
        }
        
        const pendulumString = document.getElementById('pendulum-string');
        if (pendulumString) {
            pendulumString.style.setProperty('--pendulum-angle', '0deg');
        }
        this.pendulumState.angle = 0;
        
        this.updatePendulumObservations("Pendulum stopped.");
    }

    measurePeriod() {
        if (!this.pendulumState.swinging) {
            this.updatePendulumObservations("Start the pendulum first!");
            return;
        }
        
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.pendulumStartTime) / 1000;
        const swings = Math.floor(elapsedTime / 2);
        const period = swings > 0 ? (elapsedTime / swings).toFixed(2) : 0;
        
        this.pendulumState.period = period;
        
        const length = 0.5; // 50cm in meters
        const calculatedG = (4 * Math.PI * Math.PI * length) / (period * period);
        
        this.updatePendulumObservations(`Period: ${period}s, Calculated g: ${calculatedG.toFixed(2)} m/s²`);
    }

    resetPendulum() {
        this.stopPendulum();
        this.pendulumStartTime = 0;
        this.pendulumState.period = 0;
        this.updatePendulumObservations("Length: 50cm, Period: ---, Calculated g: ---");
    }

    updatePendulumObservations(text) {
        const observations = document.getElementById('pendulum-observations');
        if (observations) {
            observations.innerHTML = text;
        }
    }

    // Public methods to bind to React components
    bindVolcanoMethods() {
        return {
            addBakingSoda: () => this.addBakingSoda(),
            addVinegar: () => this.addVinegar(),
            mixIngredients: () => this.mixIngredients(),
            resetExperiment: () => this.resetVolcanoExperiment()
        };
    }

    bindHookesMethods() {
        return {
            setupSpring: () => this.setupSpring(),
            measureNaturalLength: () => this.measureNaturalLength(),
            addWeight: () => this.addWeight(),
            measureExtension: () => this.measureExtension(),
            resetExperiment: () => this.resetHookesExperiment()
        };
    }

    bindOhmsMethods() {
        return {
            toggleCurrent: () => this.toggleCurrent(),
            changeResistance: () => this.changeResistance(),
            resetCircuit: () => this.resetCircuit()
        };
    }

    bindPendulumMethods() {
        return {
            startPendulum: () => this.startPendulum(),
            stopPendulum: () => this.stopPendulum(),
            measurePeriod: () => this.measurePeriod(),
            resetPendulum: () => this.resetPendulum()
        };
    }

    bindNavigationMethods() {
        return {
            openExperiment: (id) => this.openExperiment(id),
            goToIndex: () => this.goToIndex(),
            showSection: (exp, section) => this.showSection(exp, section),
            playTheoryVideo: (exp, event) => this.playTheoryVideo(exp, event)
        };
    }

    // Cleanup method
    cleanup() {
        this.stopAllAnimations();
        
        if (this.volcanoRenderer) {
            this.volcanoRenderer.dispose();
        }
        
        if (this.hookesRenderer) {
            this.hookesRenderer.dispose();
        }
        
        window.removeEventListener('resize', this.handleResize);
    }
}

export default VirtualScienceLab;