<script>
  // Any layout-level JavaScript logic can go here.
</script>

<header>
  <nav class="p-4 bg-gray-200">
    <a href="/" class="mr-4">Home</a>
    <a href="/upload" class="mr-4">Upload File</a>
    <a href="/dashboard" class="mr-4">Dashboard</a>
  </nav>
</header>

<main class="p-4">
  <slot /> <!-- This is essential for rendering child routes like /upload and /dashboard -->
</main>
