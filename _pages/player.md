---
layout: default
include_styles:
  - styles/player.css
  - components/progressbar.css
extra_head: |
  <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.2/color-thief.umd.js"></script>
---

<main class="overflow-y-auto no-scrollbar">
  <div id="wrapper">
    <div class="min-w-96 sm:max-w-sm sm:mx-auto pt-4 pb-6">
      <div class="text-center mb-2">
        <p class="text-xs secondary">PLAYING FROM</p>
        <h5 class="text-sm font-semibold primary">{{ page.collection_name | default: 'Name' }}</h5>
      </div>
      {% include templates/player.html %}
      <nav>
        {% for track in page.tracks %}
          {% include templates/track.html %}
        {% endfor %}
      </nav>
    </div>
  </div>
</main>

<script src="/assets/js/player/index.js" type="module"></script>
<script src="/assets/js/progressbar/index.js" type="module"></script>

{% include scripts/handle-selected.js.html %}
{% include scripts/player.js.html %}
