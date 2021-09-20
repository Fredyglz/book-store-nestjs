import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { ReadBookDto } from './dtos/read-book.dto';
import { Book } from './book.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UnauthorizedException } from '@nestjs/common';
import { UpdateBookDto } from './dtos/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('userId must be sent');
    }

    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: 'ACTIVE' },
    });
    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: 'ACTIVE' },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBooksByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('id must be sent');
    }

    console.log(authorId)
    const books: Book[] = await this._bookRepository.createQueryBuilder('books')
      .leftJoinAndSelect("books.authors", "users")
      .where('books.status = :status', { status: 'ACTIVE' })
      .andWhere("users.id = :id", { id: authorId})
      .getMany();
    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    // Validations
    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { estatus: 'ACTIVE' },
      });
      
      if (!authorExists) {
        throw new NotFoundException(
          `There's not an author with this is: ${authorId}`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        );
      }

      authors.push(authorExists)
    }

    // Saved book in database
    const savedBook: Book = await this._bookRepository.save({
        name: book.name,
        description: book.description,
        authors
    })

    return plainToClass(ReadBookDto, savedBook);
  }

  async createByAuthor(book: Partial<CreateBookDto>, authorId: number): Promise<ReadBookDto> {
      const author = await this._userRepository.findOne(authorId, {
          where: { estatus: 'ACTIVE' }
      })

      const isAuthor = author.roles.some(
          (role: Role) => role.name === RoleType.AUTHOR
      )

      if(!isAuthor) {
          throw new UnauthorizedException(`This user ${authorId} is not an author`)
      }

      const savedBook: Book = await this._bookRepository.save({
          name: book.name,
          description: book.description,
          author
      });

      return plainToClass(ReadBookDto, savedBook)
  }

  async update(book: Partial<UpdateBookDto>, bookId: number, authorId: number): Promise<ReadBookDto> {
      const bookExists = await this._bookRepository.findOne(bookId, {
          where: { status: 'ACTIVE' }
      })
      if(!bookExists) {
          throw new NotFoundException('This book does not exists');
      }

      const isOwnBook = bookExists.authors.some(
          author => author.id === authorId
      );
      if(!isOwnBook) {
          throw new UnauthorizedException(`This user isn´t the book´s author`)
      }

      const updateBook = await this._bookRepository.update(bookId, book);
      return plainToClass(ReadBookDto, updateBook)
  }

  async delete(bookId: number): Promise<void> {
      const bookExists = await this._bookRepository.findOne( bookId, {
          where: { status: 'ACTIVE' }
      })
      if(!bookExists) {
          throw new NotFoundException('This book does not exists')
      }

      await this._bookRepository.update(bookId, {
          status: 'INACTIVE'
      })
  }

}
