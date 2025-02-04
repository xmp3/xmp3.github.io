---
layout: default
extra_head: |
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.min.js"></script>
---

<header class="min-w-96 sm:max-w-sm sm:mx-auto mt-6 mb-4 px-4">
  {% include components/search-bar.html
  id="search-bar"
  class="mb-6"
  spellcheck="false"
  autocomplete="off"
  placeholder="What do you want to listen to?" %}
  <nav class="flex gap-x-2">
    <a href="#all" class="chip item" attr-id="all" attr-selected="false">All</a>
    <a href="#artist" class="chip item" attr-id="artist" attr-selected="false">Artists</a>
    <a href="#music" class="chip item" attr-id="music" attr-selected="false">Music</a>
    <a href="#playlist" class="chip item" attr-id="playlist" attr-selected="false">Playlists</a>
  </nav>
</header>

<main class="min-w-96 sm:max-w-sm sm:mx-auto mb-6">
  <nav>
    {% assign sorted_collections = page.collections | sort: 'name' %}
    {% for collection in sorted_collections %}
      {% include templates/tracks.html collection=collection %}
    {% endfor %}
  </nav>
</main>

{% include scripts/listitem.js.html %}
{% include scripts/user.js.html %}
