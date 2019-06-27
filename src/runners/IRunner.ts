export interface IRunner {
  createProject(): void;
  createPage(): void;
  createTestCase(): void;
  startServer(): void;
  stopServer(): void;
  openRepo(): void;
}
