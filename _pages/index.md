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
  <div class="w-96 mx-auto pt-4 px-4 pb-6 flex justify-center items-start grid grid-cols-2 gap-4" id="sections">
    <h6 class="text-base font-bold col-span-2">Browse all</h6>
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

  <nav class="min-w-96 sm:max-w-sm sm:mx-auto pb-6 hidden" id="collections">
    {% assign sorted_collections = site.data.pages | where: "id", "music" | sort: 'name' %}
    {% for collection in sorted_collections %}
      {% include templates/collection.html collection=collection %}
    {% endfor %}
  </nav>
</main>

{% include scripts/handle-selected.js.html %}
{% include scripts/search.js.html %}
{% include scripts/index.js.html %}
