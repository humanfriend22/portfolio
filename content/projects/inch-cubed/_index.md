---
title: "Inch Cubed"
summary: "A 3D-printed Burj Khalifa under a one-cubic-inch material limit."
stack: [Fusion 360, 3D printing]
deda_only: true
date: 2024-12-01
---

## Overview

The challenge: design and 3D print a model using no more than 1 in³ of material, excluding supports, that fits in 6" x 6" x 4".

I modeled the **Burj Khalifa** by tracing each floor from a floor plan in Fusion 360 and extruding each section to a height set by a parameter. To save material, I hollowed the bottom layers and a cylinder about halfway up.

## Result

The print measured 5.874" x 1.539" x 1.378". Fusion estimated 0.936 in³, but the slicer estimated 1.565 in³, over the limit. I also learned that the thinner upper sections print weaker, because each layer bonds more strongly to itself than to adjacent layers.
