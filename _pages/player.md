---
layout: default
include_styles:
  - styles/player.css
  - components/progressbar.css
extra_head: |
  <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.2/color-thief.umd.js"></script>
---

<main class="min-w-96 min-h-screen sm:max-w-sm mt-12 sm:mx-auto mb-6">
  {% include templates/player.html %}
  <nav>
    {% for track in page.tracks %}
      {% include templates/track.html %}
    {% endfor %}
  </nav>
</main>

<script src="/assets/js/player/index.js" type="module"></script>
<script src="/assets/js/progressbar/index.js" type="module"></script>

{% include scripts/handle-selected.js.html %}
{% include scripts/player.js.html %}
