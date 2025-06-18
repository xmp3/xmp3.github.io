---
layout: default
include_styles:
  - styles/index.css
extra_head: |
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.min.js"></script>
  <script src="https://unpkg.com/infinite-scroll@4/dist/infinite-scroll.pkgd.min.js"></script>
---

{% include templates/header.html %}

<main class="overflow-y-auto no-scrollbar">
  <div class="w-96 mx-auto mt-4 mb-6 px-4 flex justify-center items-start grid grid-cols-2 gap-4" id="sections">
    {% for section in site.data.sections %}
      <a href="{{ section.href }}">
        {% include components/section-card.html
          name=section.name
          class=section.class
          src=section.src
        %}
      </a>
    {% endfor %}
  </div>

  <nav class="w-96 mx-auto hidden" id="collections">
    {% assign sorted_collections = site.data.pages | where: "id", "music" | sort: 'name' %}
    {% for collection in sorted_collections %}
      {% include templates/collection.html collection=collection %}
    {% endfor %}
  </nav>
</main>

{% include scripts/handle-selected.js.html %}
{% include scripts/search.js.html %}
{% include scripts/index.js.html %}
