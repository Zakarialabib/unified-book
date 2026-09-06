<script lang="ts">
  import { onMount } from 'svelte';

  export let collection: string = 'astro';
  export let slug: string = '';

  let code = '';
  let output = '';
  let language = 'typescript';
  let editing = false;

  onMount(() => {
    const examples = getExamples(collection, slug);
    if (examples.length > 0) {
      code = examples[0].code;
      language = examples[0].language;
    }
  });

  function getExamples(coll: string, s: string) {
    const examples: Array<{ code: string; language: string }> = [];
    
    if (coll === 'svelte') {
      examples.push({
        code: `let count = $state(0);\n\n$effect(() => {\n  console.log('Count:', count);\n});`,
        language: 'svelte'
      });
    } else if (coll === 'rust') {
      examples.push({
        code: `fn main() {\n    let name = String::from("Rust");\n    println!("Hello, {}!", name);\n}`,
        language: 'rust'
      });
    } else {
      examples.push({
        code: `---// src/pages/index.astro\nimport { getCollection } from 'astro:content';\nconst chapters = await getCollection('astro');`,
        language: 'astro'
      });
    }
    
    return examples;
  }

  function copyCode() {
    navigator.clipboard.writeText(code).catch(() => {});
  }

  function runCode() {
    output = `// Running ${language} code...\n// Output would appear here`;
  }
</script>

<div class="interactive-demo">
  <div class="demo-header">
    <span class="demo-lang">{language}</span>
    <div class="demo-actions">
      <button on:click={copyCode} title="Copy code">📋 Copy</button>
      <button on:click={runCode} title="Run code">▶ Run</button>
    </div>
  </div>
  <pre class="demo-code"><code class="language-{language}">{code}</code></pre>
  {#if output}
    <div class="demo-output">
      <strong>Output:</strong>
      <pre>{output}</pre>
    </div>
  {/if}
</div>

<style>
  .interactive-demo {
    border: 1px solid var(--rule);
    border-radius: 12px;
    overflow: hidden;
    margin: 1.5rem 0;
    background: var(--bg-code);
  }
  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--bg-2);
    border-bottom: 1px solid var(--rule);
    font-family: var(--serif-display);
    font-size: 0.82rem;
  }
  .demo-lang {
    color: var(--accent);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .demo-actions button {
    font-family: var(--serif-display);
    font-size: 0.78rem;
    color: var(--ink-2);
    background: var(--bg-3);
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 0.2rem 0.6rem;
    cursor: pointer;
    margin-left: 0.5rem;
  }
  .demo-actions button:hover { color: var(--accent); border-color: var(--accent); }
  .demo-code {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
  }
  .demo-code code {
    font-family: var(--mono);
    font-size: 0.86rem;
    line-height: 1.7;
    background: none;
    border: none;
    padding: 0;
    white-space: pre;
  }
  .demo-output {
    padding: 1rem;
    border-top: 1px solid var(--rule);
    font-family: var(--mono);
    font-size: 0.86rem;
  }
  .demo-output pre {
    margin: 0.5rem 0 0;
    white-space: pre-wrap;
  }
</style>
