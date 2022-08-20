function createNode(value) {
    return {
      value: value,
      next: null,
    };
}
  
class LinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
  
    insert(value) {
      this.length++;
      let node = createNode(value); // or use new Node(value);
  
      if (this.tail) {
        this.tail.next = node;
        this.tail = node;
        return node.value;
      }
  
      this.head = this.tail = node;
      return node.value;
    }
  
    insertHead(value) {
      this.length++;
      let node = createNode(value);
  
      if (this.head) {
        node.next = this.head;
        this.head = node;
        return node.value;
      }
  
      this.head = this.tail = node;
      return node.value;
    }
  
    removeHead() {
      if (this.head) {
        this.length--;
        const removedNode = this.head;
        this.head = this.head.next;
        return removedNode.value;
      }
      return undefined;
    }
  
    remove() {
      if (this.tail) {
        this.length--;
  
        const tailNode = this.tail;
  
        // search for the node before tail
        let currentNode = this.head;
  
        while (currentNode.next != tailNode) {
          currentNode = currentNode.next;
        }
        const beforeTail = currentNode;
        this.tail = beforeTail;
        this.tail.next = null;
  
        return tailNode.value;
      }
      return undefined;
    }
  
    print() {
      let current = this.head;
      while (current) {
        console.log(current.value);
        current = current.next;
      }
    }
  }