const { OpenAI } = require("openai");
const core = require("@actions/core");
const github = require("@actions/github");

async function runCodeReview() {
  try {
    // Get inputs
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const diffText = process.env.DIFF_TEXT;
    const customInstructions = process.env.CUSTOM_INSTRUCTIONS || "";
    const prNumber = process.env.PR_NUMBER;
    const githubToken = process.env.GITHUB_TOKEN;
    const commentId = process.env.COMMENT_ID;
    const username = process.env.COMMENT_USERNAME || "user";

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Create the prompt
    const prompt = `You are a code reviewer. You will be given a Git diff of code changes.
    Your task is to review the changes and provide constructive feedback. 
    
    No need to review deleted files.

    Focus on:
    1. Code quality and best practices
    2. Potential bugs or edge cases
    3. Security vulnerabilities
    4. Performance issues
    5. Maintainability and readability

    ${customInstructions}

    For each issue you find, provide:
    - A clear description of the issue
    - The file and line number where it occurs
    - The code snippets to show the issue and potentially how to fix it (if applicable)
    - A suggestion for how to fix it (if applicable)
    - If applicable, an explanation of why your suggestion is better

    Be specific and actionable. Provide code examples when helpful.
    If the code looks good, acknowledge good practices you observe.
    Be courteous and professional.

    Format your review with markdown for better readability.
    - The Issues should be grouped by file.
    - In each issue, you should add a checkbox for each issue you find so that the user can check them off to keep track of the issues.
    - If the issue is not a big deal, you can use a ✅ emoji.
    - If the issue is a big deal, you can use a ❌ emoji.
    - If the issue is a suggestion, you can use a 💡 emoji.
    - e.g. an issue header is like this: - [ ] ❌ issue description
    - e.g. a suggestion header is like this: - [ ] 💡 suggestion description

    Here is the diff:
    ${diffText}`;

    console.log("Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 100 times cheaper than gpt-4
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 8192,
    });

    const reviewContent = response.choices[0].message.content;
    console.log("Successfully received response from OpenAI API");

    // Create a GitHub client
    const octokit = github.getOctokit(githubToken);
    const context = github.context;

    // Create PR comment with the review
    await octokit.rest.issues.createComment({
      issue_number: prNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: `## 🤖 ChatGPT Code Review\n\n${reviewContent}\n\n---\n*This review was generated automatically by ChatGPT in response to @${username}'s request.*`,
    });

    // Add success reaction if comment ID is provided
    if (commentId) {
      await octokit.rest.reactions.createForIssueComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: commentId,
        content: "+1",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error in code review:", error);

    // If we have GitHub token and PR number, post error message
    try {
      const githubToken = process.env.GITHUB_TOKEN;
      const prNumber = process.env.PR_NUMBER;
      const commentId = process.env.COMMENT_ID;

      if (githubToken && prNumber) {
        const octokit = github.getOctokit(githubToken);
        const context = github.context;

        // Post error message
        await octokit.rest.issues.createComment({
          issue_number: prNumber,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: "⚠️ Sorry, I couldn't complete the code review. An error occurred while processing the request.",
        });

        // Add failure reaction if comment ID is provided
        if (commentId) {
          await octokit.rest.reactions.createForIssueComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentId,
            content: "-1",
          });
        }
      }
    } catch (secondaryError) {
      console.error("Error while handling the original error:", secondaryError);
    }

    // Rethrow the original error
    throw error;
  }
}

// Run the function
runCodeReview().catch((error) => {
  core.setFailed(`Action failed with error: ${error}`);
});
