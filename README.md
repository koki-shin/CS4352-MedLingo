<div id="top"></div>

<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/MedLingo-Logo.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">MedLingo</h3>

  <p align="center">
    A Multilingual Healthcare Companion App for ESL Patients
    <br />
    <em>Bridging language barriers in healthcare through accessible design.</em>
    <br /><br />
    <a href="https://github.com/koki-shin/CS4352-MedLingo"><strong>Explore the project »</strong></a>
    <br />
    <a href="">View Demo</a>
    ·
    <a href="https://github.com/koki-shin/CS4352-MedLingo/issues">Report Bug</a>
    ·
    <a href="https://github.com/koki-shin/CS4352-MedLingo/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

**MedLingo** is a multilingual healthcare companion app designed to help **ESL (English as a Second Language) patients** navigate medical appointments with confidence. It bridges communication gaps **before**, **during**, and **after** visits through translated forms, real-time dialogue tools, and post-appointment recaps.

This project was developed as part of **CS 4352 – Human-Computer Interaction Design (UT Dallas)**.  
Our focus is to enhance accessibility and comfort for patients who face language barriers in healthcare environments.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With
**Core:**
- **Expo** - React Native framework for cross-platform mobile development
- **Expo Router** - File-based routing system for navigation
- **React Native** - Mobile app framework for iOS, Android, and Web
- **React** - UI library for building component-based interfaces
- **TypeScript** - Typed JavaScript for type safety and better tooling

**Styling:**
- **NativeWind** - Tailwind CSS integration for React Native
- **Tailwind CSS** - Utlity-first CSS framework
- **Montserrat font family** - Custom typography

**Dev Tools**
- **ESLint** — Code linting and quality checks
- **Prettier** — Code formatting
- **Babel** — JavaScript compiler/transpiler

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Give instructions on setting up the project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

List things we need to use the software and how to install them.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Follow the steps below to explore the MedLingo prototype and test each of the three main tasks.

### 1. Before Appointment – *Pre-Visit Assessment*
- From the home screen, select your language using the language picker.
- Navigate to "Before Appointment".
- Fill out the Pre-Visit Form:
  - What brings you in today? (symptoms/reason for visit)
  - List any current medications
  - List any allergies
- Complete the consent checkboxes (medical evaluation, confidentiality, privacy/payment policies).
- Press "Submit" to translate your responses to English for the doctor's view.
- Review the translated summary.
- Use "Print to PDF" to export and share the form.
(Translation requires a Google Translate API key configured in app.json.)

### 2. During Appointment – *Translative Interface*
- Select "During Appointment".
- Use "Start Recording" to record audio during the visit (optional).
- In the "Message From Doctor" field, enter text in any language and press Enter to translate it to your selected language.
- Use the emotion buttons (Confused, Anxious, Good) to log how you're feeling; the current selection is displayed.
- Press "End Session" when finished:
  - Saves the audio recording (if used)
  - Generates a visit summary JSON file with emotions and timestamps
  - Shows a confirmation modal
(Translation requires a Google Translate API key. Audio recording requires microphone permissions.)

### 3. After Appointment – *Post-Visit Recap*
- Navigate to "After Appointment".
- Review the Diagnosis Summary (translated to your language).
- View Prescribed Medications with dosage instructions.
- Set Medication Reminders:
  - Select a medication (or add a custom one)
  - Choose times per day and specific times
  - Set repeat frequency (Daily, Weekly, Bi-weekly, Monthly)
  - Press "Set Reminder" to confirm
- Schedule Follow-up Care:
  - Telehealth Follow-up: Schedule a virtual appointment using the calendar and time picker
  - Schedule Next Appointment: Schedule an in-person visit with date and time selection
- Both scheduling options show confirmation modals with appointment details.
(All content is automatically translated based on your selected language preference.)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Project Scaffolding & Repo Setup  
    - [X] Initialize React project and folder structure  
    - [X] Create `.gitignore`, README, and initial commit  
    - [ ] Add TAs as collaborators  
    - [ ] Set up branches for each task (previsit, translation, recap)

- [ ] Design Refinement  
    - [ ] Update wireframes and task flows based on DP3 feedback  
    - [ ] Define data structure for translated content (JSON format)

- [ ] Task 1: Pre-Visit Assessment (Simple) - Working by Oct 29 Progress Check  
    - [ ] Build appointment overview screen  
    - [ ] Implement pre-visit form (symptoms, allergies, meds)  
    - [ ] Add "Translate & Submit" confirmation flow  
    - [ ] Test for smooth form submission & translation simulation  

- [ ] Task 2: Translative Interface (Medium)  
    - [ ] Design bilingual chat UI  
    - [ ] Add emoji quick responses  
    - [ ] Implement mock translation function (simulated API)  
    - [ ] Ensure doctor-patient chat flow feels real  

- [ ] Task 3: Post-Appointment Recap (Complex)  
    - [ ] Create medical summary view (diagnosis, prescriptions, follow-ups)  
    - [ ] Add visual aids section with images and text  
    - [ ] Implement translation for recap text  
    - [ ] (Optional) Simulate downloadable PDF summary  

- [ ] Usability & Polish  
    - [ ] Conduct internal heuristic evaluation  
    - [ ] Fix navigation, spacing, and color consistency  
    - [ ] Add loading/error/empty states  

- [ ] Demo & Documentation  
    - [ ] Prepare 2–3 slides for progress check  
    - [ ] Record 2-min walkthrough video  
    - [ ] Write Source.pdf, ReadMe.pdf, and Team.pdf  
    - [ ] Package .zip with PDFs and PowerPoint  
    - [ ] Submit peer evaluation form (due Nov 15)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Include teammate names + branch responsibilities



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

**Team 19 — CS 4352: Human-Computer Interaction Design**

- **Koki Shin** – [Koki.Shin@UTDallas.edu](mailto:Koki.Shin@UTDallas.edu)  
- **Jonathan Tyler** – [Jonathan.Tyler@UTDallas.edu](mailto:Jonathan.Tyler@UTDallas.edu)  
- **Tanner Raley** – [Tanner.Raley@UTDallas.edu](mailto:Tanner.Raley@UTDallas.edu)  
- **Dave Aigbe** – [Dave.Aigbe@UTDallas.edu](mailto:Dave.Aigbe@UTDallas.edu)  
- **Oluwabukunmi Adegbonmire** – [Oluwabukunmi.Adegbonmire@UTDallas.edu](mailto:Oluwabukunmi.Adegbonmire@UTDallas.edu)

📎 **Project Repository:** [github.com/koki-shin/CS4352-MedLingo](https://github.com/koki-shin/CS4352-MedLingo)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
