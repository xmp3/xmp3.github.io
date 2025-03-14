---
layout: default
include_styles:
  - styles/index.css
extra_head: |
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.min.js"></script>
  <script src="https://unpkg.com/infinite-scroll@4/dist/infinite-scroll.pkgd.min.js"></script>
---

{% include components/header.html %}

<main class="overflow-y-auto no-scrollbar">
  <div class="w-96 mx-auto mx-auto mt-4 px-4 flex justify-center items-start grid grid-cols-2 gap-4" id="sections">
    <a href="/music/#artist">
    {% include components/section-card.html
    name="Music"
    class="bg-pink-600"
    src="https://raw.githubusercontent.com/xmp3/images/the_weeknd/the_weeknd.jpeg"
    %}
    </a>
    <a href="/brazilian/#artist">
    {% include components/section-card.html
    name="Brazilian"
    class="bg-sky-900"
    src="https://raw.githubusercontent.com/xmp3/images/djavan/djavan.jpeg"
    %}
    </a>
    <a href="/pop/#artist">
    {% include components/section-card.html
    name="Pop"
    class="bg-cyan-700"
    src="https://raw.githubusercontent.com/xmp3/images/adele/adele.jpeg"
    %}
    </a>
    <a href="/rock/#artist">
    {% include components/section-card.html
    name="Rock"
    class="bg-red-500"
    src="https://raw.githubusercontent.com/xmp3/images/radiohead/radiohead.jpeg"
    %}
    </a>
  </div>
  <nav class="w-96 mx-auto hidden" id="collections">
    {% assign sorted_collections = site.data.pages | where: "id", "music" | sort: 'name' %}
    {% for collection in sorted_collections %}
      {% include templates/tracks.html collection=collection %}
    {% endfor %}
  </nav>
</main>

{% include scripts/listitem.js.html %}
{% include scripts/search.js.html %}
{% include scripts/index.js.html %}
