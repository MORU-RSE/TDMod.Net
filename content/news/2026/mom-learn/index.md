---
entry_type: post
title: MOM-Learn
date: 2026-08-31
draft: false
author: Tanaphum Wichaita
summary: MOM Learn is an interactive training website for learning Plasmodium
  falciparum blood-stage morphology and recognizing parasite changes associated
  with artesunate and quinine exposure.
tags:
  - Malaria
  - "Training "
cover:
  image: 1-20260831-102718-tz2vr2.webp
---
We have released [MOM Learn](https://maemod-moru-mom-learn-shiny.share.connect.posit.cloud/), an interactive educational website designed to help students and laboratory staff practise identifying *Plasmodium falciparum* blood-stage morphology and drug-exposure patterns.

Learners can explore annotated examples, test their skills through interactive quizzes, receive immediate feedback, and monitor their progress—all without creating an account or uploading any images.

## The challenge

Accurate malaria microscopy requires more than recognizing whether parasites are present. Microscopists must also distinguish between different blood-stage forms, including rings, trophozoites, and schizonts.

Antimalarial treatment can further alter parasite morphology. Parasites exposed to artesunate or quinine may show characteristic changes that differ from normal developmental stages. Learning to recognise these patterns requires repeated exposure to well-annotated examples and opportunities to practice.

Traditional teaching materials are valuable references, but they may provide limited opportunities for active learning. MOM Learn was developed to make this practice more accessible and interactive.

## What MOM Learn provides

MOM Learn currently includes five training classes:

* Ring stage
* Trophozoite
* Schizont
* Artesunate-exposed parasites
* Quinine-exposed parasites

The website is organised into three main learning components: Atlas, Quiz, and Progress.

### Atlas

The Atlas allows learners to browse curated examples of each parasite class. Every example includes a short explanation of the morphological features that help distinguish it from the other classes.

For example, learners can review features such as chromatin appearance, cytoplasmic shape, pigment formation, vacuolisation, and the presence of multiple merozoites.

### Quiz

The quiz provides two levels of practice.

In Normal mode, an annotated cell is highlighted and the learner selects its most likely class. After answering, the system immediately displays the expert label and explains the relevant morphological clues.

In Advanced mode, learners examine the whole blood-film image, locate suspected parasites themselves, draw boxes around them, and assign a class to each finding. Their answers are then compared with the expert annotations and classified as correct, wrong class, missed, or false positive.

This mode allows learners to practice both detecting infected cells and interpreting parasite morphology.

### Progress

Quiz performance is stored locally in the learner’s browser. The Progress page allows users to review their accuracy over time and identify the classes that may require further practice.

No user account, image upload, or central database is required.

## From annotations to training material

MOM Learn uses annotations in the YOLO format as its answer key. Each annotated cell contains its location and expert-assigned class. These annotations are used to generate the examples shown in the Atlas and the questions presented in both quiz modes.

This approach allows an existing annotated image dataset to be reused for education while maintaining a single source of truth for the parasite classifications.

The current application contains more than 8,700 annotated examples across five training classes, including two drug-exposure phenotypes.

## Accessible by design

MOM Learn is built using standard HTML, CSS, and JavaScript and runs entirely within the learner’s browser. It does not require a backend server, user login, or installation.

The responsive interface also supports mobile devices. In Advanced mode, users can switch between Scroll and Draw controls, making it possible to examine images and mark suspected parasites using a touchscreen.

## Try MOM Learn

MOM Learn is available at:

[Open the MOM Learn training website](https://maemod-moru-mom-learn-shiny.share.connect.posit.cloud/)

The source code is openly available under the MIT License:

[View MOM Learn on GitHub](https://github.com/MORU-RSE/MOM-Learn)

MOM Learn is intended for education and microscopy training only. It is not designed or validated for clinical diagnosis.
