---
entry_type: post
title: "Plasmosight: reading malaria treatment status from blood films"
date: 2026-08-17
draft: true
author: "Thanakorn Waleejaroenpong"
summary: "Plasmosight is a web application that analyses blood cell images to identify malaria parasite stages and signs of antimalarial treatment, helping clinicians assess patients who cannot report their own treatment history."
tags:
  - Plasmosight
  - malaria
  - machine learning
  - research software
cover:
  image: "cover.webp"
  alt: "The Plasmosight interface showing an uploaded blood film image and its analysis"
  caption: "Plasmosight running on a blood film image."
---

We have released **[Plasmosight](https://moru.shinyapps.io/Plasmosight/)**, a web application that analyses images of blood cells to identify malaria parasites and the morphological changes that follow antimalarial treatment. It is aimed at clinicians and laboratory staff who need to know what has already happened to a patient before deciding what to do next.

## The problem

Malaria treatment decisions depend on treatment history, and treatment history is often missing. Patients arrive at a referral hospital after being treated elsewhere, are too unwell to give an account of themselves, or simply do not know which drug they were given. The blood film is examined, parasites are counted, and the clinical picture is assembled — but the question of whether the patient has already received an antimalarial, and how the parasites have responded to it, is left to inference.

That gap matters. The same parasitaemia means something quite different in an untreated patient than in one who was dosed twelve hours earlier, and the parasites themselves carry evidence of the difference.

## What Plasmosight does

Plasmosight uses a neural network to analyse blood cell images and identify morphological changes in malaria parasites. From an uploaded image, it reports on:

- the presence of malaria parasites in the sample;
- the parasite stages visible in the film;
- morphological signatures consistent with exposure to specific antimalarial drugs.

The result is a read on the patient's treatment status derived from the blood sample itself, rather than from a history the patient may be unable to give.

<!-- IMAGE: screenshot of the upload step and the results panel -->

## Using the application

The application runs in the browser at [moru.shinyapps.io/Plasmosight](https://moru.shinyapps.io/Plasmosight/) with no installation or account required. The interface is available in Thai and English. Upload a blood film image, and the analysis is returned in the same session.

The interface was designed to keep the workload on busy staff low: a single upload step, results laid out in one view, and no configuration to get wrong.

<!-- IMAGE: example of an annotated result, ideally a treated and an untreated sample side by side -->

## Scope and limitations

Plasmosight is a research tool. It is intended to support the judgement of trained clinical and laboratory staff, not to replace microscopy, diagnostic testing, or clinical assessment, and it should not be used as the sole basis for a treatment decision.

<!-- TODO: add the specifics you want on record — training data and its provenance, the species and drugs covered, image and staining requirements, and reported performance. Anyone evaluating the tool will look for these. -->

## Feedback

We are interested in hearing from clinicians, microscopists, and researchers who try the application, particularly on where the outputs are useful in practice and where they fall short. Enquiries can be sent through the [contact routes on our About page]({{< relref "/about" >}}).
