---
layout: default
include_styles:
  - styles/section.css
extra_head: |
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.min.js"></script>
  <script src="https://unpkg.com/infinite-scroll@4/dist/infinite-scroll.pkgd.min.js"></script>
---

{% include templates/header.html %}

<main class="overflow-y-auto no-scrollbar">
  <nav class="min-w-96 sm:max-w-sm sm:mx-auto mb-6" id="collections">
    {% assign sorted_collections = page.collections | sort: 'name' %}
    {% for collection in sorted_collections %}
      {% include templates/collection.html collection=collection %}
    {% endfor %}
  </nav>
</main>

{% include scripts/handle-selected.js.html %}
{% include scripts/search.js.html %}
