---
layout: single
title: "About Me"
permalink: /about/
author_profile: true
toc: false
classes: wide
---

I like reading sci-fis, especially those written by scholars with professional domain knowledge.

I like classical music, and I managed to self-taught violin for a while. Would love to spend more time on it if resources (time, tutor investment, etc.) allow.

{% assign video_id = "WcA0odcNuJU" %}
<div class="video-preview">
  <a href="https://www.youtube.com/watch?v={{ video_id }}">
    <img src="http://img.youtube.com/vi/{{ video_id }}/mqdefault.jpg" alt="Violin Performance">
    <div class="play-button"></div>
  </a>
</div>

<br>

I am also a certified scuba diver, massive thanks to Hart House Underwater Club at the University of Toronto.

{% assign video_id = "hKapxQDui50" %}
<div class="video-preview">
<a href="https://www.youtube.com/watch?v={{ video_id }}">
    <img src="http://img.youtube.com/vi/{{ video_id }}/mqdefault.jpg" alt="Scuba Diving Video 1">
    <div class="play-button"></div>
</a>
</div>

<br>

And some outdoor activities here.

{% assign video_id = "OQ43KjLR0yU" %}
<div class="video-preview">
  <a href="https://www.youtube.com/watch?v={{ video_id }}">
    <img src="http://img.youtube.com/vi/{{ video_id }}/mqdefault.jpg" alt="Outdoor Activities">
    <div class="play-button"></div>
  </a>
</div>

<style>
.video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2em;
  margin: 2em 0;
}

.video-preview {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 1em 0;
}

.video-preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M8 5v14l11-7z'/%3E%3C/svg%3E");
  background-size: cover;
  opacity: 0.9;
}

.video-preview:hover .play-button {
  opacity: 1;
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .video-preview {
    margin: 1em auto;
  }
}
</style>

