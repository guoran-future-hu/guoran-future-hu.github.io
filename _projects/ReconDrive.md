---
title: "ReconDrive: Fast Feed-Forward 4D Gaussian Splatting for Autonomous Driving"
date: 2026-03-08
conference: "arXiv preprint"
excerpt: ""
# header:
#   image: /assets/images/project-header.jpg
#   teaser: assets/images/project-teaser.jpg
---

ReconDrive is a high-performance feed-forward framework designed to transform multi-view video from autonomous vehicles into high-fidelity 4D (3D + time) digital twins in seconds. By extending the 3D foundation model VGGT, we bridge the gap between slow, high-quality optimization methods and fast, low-quality feed-forward approaches

[arXiv Link](https://arxiv.org/abs/2603.07552)

--------------------------------------------------------------------------------
# 🚀 The Breakthrough: 15 Seconds vs. 45 Minutes

Traditional 4D Gaussian Splatting (4DGS) methods rely on "per-scene optimization," which requires iteratively training a model for every new street, often taking 30 to 46 minutes per 20-second clip.
ReconDrive achieves state-of-the-art results in just 15 seconds through a single forward pass, making large-scale urban reconstruction truly scalable for the first time.

--------------------------------------------------------------------------------
# 🛠️ Core Methodology

{% include figure image_path="/assets/images/recon-drive-framework.png" alt="Alt text"%}

ReconDrive adapts 3D foundation models to the complex, dynamic nature of driving environments through three technical pillars:
1. Hybrid Gaussian Prediction Heads
To fix the "photometric deficiency" (blurriness) common in foundation models, we decouple the prediction of spatial coordinates and appearance.
- Spatial: Uses camera calibration to anchor objects precisely in 3D space.
- Appearance: Fuses raw image textures back into the model to preserve fine-grained details like leaves and building edges.
2. Static-Dynamic 4D Composition
Driving scenes are a mix of static backgrounds and moving traffic. We use SAM2 to segment moving objects and assign them temporal velocity vectors. This allows the model to predict where a car will be at any timestamp within a segment, enabling smooth 4D playback.
3. Segment-wise Temporal Fusion
To handle long-duration drives, we partition the world into temporal segments. We then fuse these localized Gaussian clusters into a unified representation, ensuring temporal consistency across the entire route.

--------------------------------------------------------------------------------
# 📈 Performance & Results

ReconDrive was benchmarked on the nuScenes dataset across reconstruction, novel-view synthesis, and 3D perception tasks.
- Metric Superiority: It is the first feed-forward method to surpass "gold-standard" optimization methods in 8 out of 9 metrics.
- Visual Fidelity: Achieved a 32.66 PSNR in reconstruction, significantly outperforming existing feed-forward baselines (22.83 PSNR).
- Downstream Utility: The generated scenes are so accurate they can be used to test AI perception, achieving 26.7% mAP in 3D object detection.

{% include figure image_path="/assets/images/recon-drive-visualization.png" alt="Alt text" caption="" %}

--------------------------------------------------------------------------------

# 🔗 Citation

If you find this work useful, please cite:
```
@article{yu2026recondrive,
  title={ReconDrive: Fast Feed-Forward 4D Gaussian Splatting for Autonomous Driving Scene Reconstruction},
  author={Yu, Haibao and Xiao, Kuntao and Wang, Jiahang and Hao, Ruiyang and Huang, Yuxin and Hu, Guoran and Qin, Haifang and Jing, Bowen and Bo, Yuntian and Luo, Ping},
  journal={arXiv preprint},
  year={2026}
}
```
