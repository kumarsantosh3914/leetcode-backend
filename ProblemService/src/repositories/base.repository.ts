import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";

abstract class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  /**
   * Create a new document
   * @param data Document data to create
   * @returns Promise of created document
   */
  async create(data: Partial<T>): Promise<T> {
    const record = new this.model(data);
    return await record.save();
  }

  /**
   * Find document by ID
   * @param id Document ID
   * @returns Promise of found document or null
   */
  async findById(id: string | Types.ObjectId): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    return await this.model.findById(id);
  }

  /**
   * Find all documents matching the filter
   * @param filter Filter query
   * @param options Query options (pagination, sorting, etc.)
   * @returns Promise of found documents
   */
  async findAll(): Promise<T[]> {
    const records = await this.model.find();

    if (!records) {
      throw new NotFoundError("No records found");
    }

    return records;
  }

  /**
   * Update document by ID
   * @param id Document ID
   * @param updateData Update data
   * @returns Promise of updated document
   */
  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<T>
  ): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }

    const record = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      throw new NotFoundError("Document not found");
    }

    return record;
  }

  /**
   * Delete document by ID
   * @param id Document ID
   * @returns Promise of deleted document
   */
  async delete(id: string | Types.ObjectId): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }

    const record = await this.model.findByIdAndDelete(id);

    if (!record) {
      throw new NotFoundError("Record not found");
    }

    return record;
  }

  /**
   * Check if document exists
   * @param filter Filter query
   * @returns Promise of boolean indicating existence
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    return (await this.model.exists(filter)) !== null;
  }

  /**
   * Count documents matching the filter
   * @param filter Filter query
   * @returns Promise of count
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}

export default BaseRepository;
