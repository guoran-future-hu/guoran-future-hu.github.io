---
title: "ReconDrive：面向自动驾驶的快速前馈式 4D Gaussian Splatting"
date: 2026-03-08
---

ReconDrive 是一个前馈式重建框架，能够在数秒内将自动驾驶的多视角视频转化为高保真的动态三维场景。我们扩展了三维基础模型 VGGT，希望兼顾优化方法的重建质量与前馈方法的速度。

[阅读 arXiv 论文](https://arxiv.org/abs/2603.07552)

# 核心突破：15 秒与 45 分钟

传统 4D Gaussian Splatting（4DGS）依赖逐场景优化，需要为每段街景反复训练模型。处理一段 20 秒的视频通常需要 30 到 46 分钟。

ReconDrive 只需一次前向推理，便能在 15 秒内获得领先的重建效果，更适合大规模城市场景的重建。

# 核心方法

{% include figure image_path="/assets/images/recon-drive-framework.png" alt="ReconDrive 方法框架" %}

ReconDrive 将三维基础模型适配到复杂、动态的驾驶环境，主要包含三个部分：

1. **混合高斯预测头。** 为改善基础模型的模糊问题，将空间坐标预测与外观预测解耦。空间分支利用相机标定来精确定位；外观分支融合原始图像纹理，保留树叶、建筑边缘等细节。
2. **静态与动态四维组合。** 驾驶场景由静态背景和动态交通参与者组成。我们使用 SAM2 分割运动物体，并为其分配时间相关的速度向量，从而预测物体在片段中任意时刻的位置，实现平滑的四维回放。
3. **分段时序融合。** 将长时驾驶过程划分为多个片段，再把局部高斯簇融合为统一的场景表示，保持整段路线的时间一致性。

# 性能与结果

ReconDrive 在 nuScenes 数据集上进行了场景重建、新视角合成与三维感知评估。

- **指标表现：** 在 9 项指标中的 8 项上超过作为参照的优化方法。
- **视觉质量：** 重建 PSNR 达到 32.66，高于已有前馈基线的 22.83。
- **下游任务：** 重建场景可用于评估 AI 感知能力，三维目标检测达到 26.7% mAP。

{% include figure image_path="/assets/images/recon-drive-visualization.png" alt="ReconDrive 重建效果对比" %}

# 引用

如果这项工作对你有帮助，欢迎引用：

```bibtex
@article{yu2026recondrive,
  title={ReconDrive: Fast Feed-Forward 4D Gaussian Splatting for Autonomous Driving Scene Reconstruction},
  author={Yu, Haibao and Xiao, Kuntao and Wang, Jiahang and Hao, Ruiyang and Huang, Yuxin and Hu, Guoran and Qin, Haifang and Jing, Bowen and Bo, Yuntian and Luo, Ping},
  journal={arXiv preprint},
  year={2026}
}
```
